<script setup lang="ts">
import { ref, type Ref } from 'vue';
import Landing from './pages/landing/landing.vue';
import Categories from './pages/categories/categories.vue';
import MagicNumber from './pages/magicNumber/magicNumber.vue';
import { Pages, type Category, type CurrentPage, type CharacterBooleanMap } from './types';

type TitleState = CharacterBooleanMap<typeof titleCharacters>

const currentPage: Ref<CurrentPage> = ref("landing")
const pages: CurrentPage[] = [Pages.Landing, Pages.CategorySelecting, Pages.MagicNumberSelecting, Pages.SelectionSummary, Pages.Result]

const titleCharacters = "MASH"


const titleCharMeaning = (character: string) => {
  switch (character) {
            case "M":
              return "Mansion"
            case "A":
              return "Apartment"
            case "S":
              return "Shack"
            case "H":
              return "House"
            default:
              break;
  }  
}

/** Instantiate a blank TitleState object */
const titleState = ref<TitleState>({})
/** 
 * Loop through the characters in titleCharacters, 
 * applying a 'default' false value to each character 
 */
titleCharacters.split("").forEach(char => titleState.value[char] = false)

const selectedCategories = ref<Category[]>([])
const magicNumber = ref<number>(0)
const finalState = ref<{option: string, category: string, struck: boolean}[]>([])

// replace this with a ref object. Make the returned value an object.
// Make the current "option" part the key, and 'category' & 'struck' the value 
// then utilise this in the algorithm runner to make your life easier and avoid that spaghettified nonsense you've been writing.
const allTheOptionsAsAnArray = () => {
  const options = [
    {option: "M", category: "title", struck: false},
    {option: "A", category: "title", struck: false},
    {option: "S", category: "title", struck: false},
    {option: "H", category: "title", struck: false}
  ]
  selectedCategories.value.filter(x => x.selected).forEach((category) => {
    category.values.forEach((value) => {
      options.push({
        option: value.name, category: category.name, struck: false
      })
    })
  })
  return options
}

// it's real late, and I can't think of an appropriate name for this function
const allDone = (allTheThings: {option: string, category: string, struck: boolean}[]) => {
  const allTheCategories = Array.from(new Set(allTheThings.map((x)=>x.category)))
  for (const category in allTheCategories) {
    const unstruckItemsInCategory = allTheThings.filter((x) => x.category === allTheCategories[category] && !x.struck)

    if (
      unstruckItemsInCategory.length > 1
    ) return false
  }
  return true
}

const findNextUnstruck = (lastIndexStruck: number, allTheThings: {option: string, category: string, struck: boolean}[]) => {
  // Count unstruck items per category
  const unstruckByCategory: Record<string, number> = {}
  for (const item of allTheThings) {
    if (!item.struck) {
      unstruckByCategory[item.category] = (unstruckByCategory[item.category] || 0) + 1
    }
  }

  // Build the list of "eligible" items (categories with > 1 survivor)
  const eligibleItems = allTheThings.filter(
    x => !x.struck && unstruckByCategory[x.category] > 1
  )

  if (eligibleItems.length === 0) {
    return -1 // nothing left to strike
  }

  // Advance `magicNumber` steps
  const nextIndex = (lastIndexStruck + magicNumber.value) % eligibleItems.length

  const nextUnstruckItem = eligibleItems[nextIndex]


  // Return its index in the full array so algo can update source-of-truth
  return allTheThings.findIndex(
    x => x.option === nextUnstruckItem.option && x.category === nextUnstruckItem.category
  )
}



const allCategoriesFilled = () => {
    for (let i in selectedCategories.value) {
        if (selectedCategories.value[i].values.length < 3) return false
        for (let x in selectedCategories.value[i].values) {
            if (selectedCategories.value[i].values[x].name === "") return false
        }
    }
    return true
}
const enoughCategoriesSelected = () => {
    return selectedCategories.value.filter(x => x.selected).length >= 4
}

const disableNext = () => {
  switch (currentPage.value) {
    case Pages.CategorySelecting:
      return !allCategoriesFilled() && !enoughCategoriesSelected()
    case Pages.MagicNumberSelecting:
      return magicNumber.value === 0
    case Pages.SelectionSummary:
      return false
    default:
      break;
  }
}

const runMASHAlgorithm = async () => {
  let lastIndexStruck = 0
  let delay = 1000
  const minDelay = 150
  const delayStep = 150

  const allTheThings = allTheOptionsAsAnArray()


  while (!allDone(allTheThings)) {

    await new Promise(resolve => setTimeout(resolve, delay))

    const nextUnstruckIndex = findNextUnstruck(lastIndexStruck, allTheThings)


    const valueToStrike = allTheThings[nextUnstruckIndex]


    if (valueToStrike.category === "title") {

      // updating the ref object allows vue to display the changes as per req.
      titleState.value[valueToStrike.option] = true
      // aaand then we have to update the array we're looping through to ensure
      //  the algo works correctly
      allTheThings[nextUnstruckIndex].struck = true
    } else {

      const refCategory = selectedCategories.value.findIndex((x) => x.name === valueToStrike.category)

      const categoryValue = allTheThings.findIndex(value => value.option === valueToStrike.option)
      const refCategoryValue = selectedCategories.value[refCategory].values.findIndex(value => value.name === valueToStrike.option)
      allTheThings[categoryValue].struck = true
      selectedCategories.value[refCategory].values[refCategoryValue].struck = true

    }

    lastIndexStruck = nextUnstruckIndex

    delay = (delay - delayStep) < minDelay ? minDelay : delay - delayStep
  }
  finalState.value = allTheThings.filter(x => !x.struck)
  await new Promise(resolve => setTimeout(()=>{
    currentPage.value = Pages.Result
    resolve(true)
  }, 1500))
}

</script>

<template>
  <div id="mash-container">

    <div 
      id="mash-title"
      :class="`position-${currentPage}`"
    >
      <component 
        class="mash-title-char"
        v-for="(character) in Object.keys(titleState)"
        :is="titleState[character] ? 's' : 'span'"
      >
        {{ character }}
      </component>
    </div>

    <button
        v-if="currentPage !== Pages.Landing"
        :disabled="pages.indexOf(currentPage) === 0"
        v-on:click="
            currentPage = pages.indexOf(currentPage) > 0 ? pages[pages.indexOf(currentPage) - 1] : currentPage
        "
    >
        Back <
    </button>
    <button
        v-if="currentPage !== Pages.Landing"
        :disabled="pages.indexOf(currentPage) === pages.length-1 || disableNext()"
        v-on:click="
            currentPage = pages.indexOf(currentPage) < pages.length ? pages[pages.indexOf(currentPage) +1] : currentPage
        "
    >
        > Next
    </button>
    
    <transition name="fade">
      <Landing 
        :currentPage="currentPage" 
        @update:currentPage="val => currentPage = val" 
      />
    </transition>

    <transition name="fade">
      <Categories 
        v-if="currentPage === Pages.CategorySelecting || currentPage === Pages.SelectionSummary"
        :currentPage="currentPage" 
        @update:selectedCategories="val => selectedCategories = val"
      />
    </transition>

    <transition name="fade">
      <MagicNumber
      v-if="currentPage === Pages.MagicNumberSelecting || currentPage === Pages.SelectionSummary"
      :currentPage="currentPage"
      @update:magicNumber="val => magicNumber = val"
      />
    </transition>

    <transition name="fade">
      <div 
        id="selection-summary"
        v-if="currentPage === Pages.SelectionSummary"
      >
        <button
          @click="runMASHAlgorithm()"
        >
          Go!
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div id="result" v-if="currentPage === Pages.Result">
        <span>You will live in a </span>
        <span v-for="char in finalState.filter(x => x.category === 'title')">
          {{ titleCharMeaning(char.option) }}
        </span>
        <span>, with: <br/></span>
        <span
          v-for="result, i in finalState.filter(x => x.category !== 'title')"
        >
          <span>{{ result.category }}: {{ result.option }}</span>  
          <span v-if="i < finalState.length - 3">, <br/></span>
          <span v-if="i === finalState.length - 3"><br/>and </span>
        </span>
      </div>
    </transition>

  </div>
</template>

<style scoped>
#mash-title {
  position:absolute;
  transform:translate(-50%, -50%);
  transition: top 0.5s 0.4s ease, left 0.5s 0.4s ease;
  
  left:50%;
  font-size: 3em;
  &.position-landing {
    top:35%;
    left: 50%;
  }
  &.position-category-selecting {
    top:15%;
    left: 25%;
  }
  &.position-magic-number-selecting {
    top:15%;
    left: 75%;
  }
  &.position-selection-summary {
    top:10%;
    left: 50%;
  }
  &.position-result {
    top:20%;
  }
}

</style>
