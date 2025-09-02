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

/** Instantiate a blank TitleState object */
const titleState: TitleState = {}
/** 
 * Loop through the characters in titleCharacters, 
 * applying a 'default' false value to each character 
 */
titleCharacters.split("").forEach(char => titleState[char] = false)

const selectedCategories = ref<Category[]>([])
const magicNumber = ref<number>(0)

// replace this with a ref object. Make the returned value an object.
// Make the current "option" part the key, and 'category' & 'struck' the value 
// then utilise this in the algorithm runner to make your life easier and avoid that spaghettified nonsense you've been writing.
const allTheOptionsAsAnArray = () => {
  const options = [
    {option: "M", category: "title", struck: titleState.M},
    {option: "A", category: "title", struck: titleState.A},
    {option: "S", category: "title", struck: titleState.S},
    {option: "H", category: "title", struck: titleState.H}
  ]
  selectedCategories.value.forEach((category) => {
    category.values.forEach((value) => {
      options.push({
        option: value, category: category.name, struck: false
      })
    })
  })
  return options
}

// it's real late, and I can't think of an appropriate name for this function
const allDone = () => {
  const allTheThings = allTheOptionsAsAnArray()
  const allTheCategories = new Set(allTheThings.map((x)=>x.category))

  for (let category in allTheCategories) {
    if (
      allTheThings
      .filter((x) => x.category === category && !x.struck)
      .length !== 1
    ) return false
  }
}

const findNextUnstruck = (lastIndexStruck: number) => {
  const allTheThings = allTheOptionsAsAnArray()
  const nextUnstruckItem = allTheThings.filter((x) => !x.struck)[lastIndexStruck + magicNumber.value]
  return allTheThings.indexOf(nextUnstruckItem)
}


const titleOptions = allTheOptionsAsAnArray().filter((x) => { return ["M","A","S","H"].includes(x.option)} )

const allCategoriesFilled = () => {
    for (let i in selectedCategories.value) {
        if (selectedCategories.value[i].values.length < 3) return false
        for (let x in selectedCategories.value[i].values) {
            if (selectedCategories.value[i].values[x] === "") return false
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

const runMASHAlgorithm = () => {
  let lastIndexStruck = 0
  while (allDone() === false) {
    const allTheThings = allTheOptionsAsAnArray()
    const nextUnstruckIndex = findNextUnstruck(lastIndexStruck)
    // this will only work for one loop of the array atm. Need to enable it to loop back around to the beginning
    if (allTheThings[nextUnstruckIndex].category === "title") {
      titleState[allTheThings[nextUnstruckIndex].option] = true
    } else {
      const indexOfCategoryContainingOptionToBeStruck = selectedCategories.value.findIndex((x) => x.name === allTheThings[nextUnstruckIndex].category)
      const indexOfOptionInCategoryToBeStruck = selectedCategories.value[indexOfCategoryContainingOptionToBeStruck].values.findIndex((x) => x === allTheThings[nextUnstruckIndex].option)
      selectedCategories.value[indexOfCategoryContainingOptionToBeStruck]
        .values[indexOfOptionInCategoryToBeStruck] = 

      selectedCategories.value[
        selectedCategories.value.findIndex((x) => x.name === allTheThings[nextUnstruckIndex].category)
      ].values = {
        ...selectedCategories
        .value[
          selectedCategories.value.findIndex(
            (x) => x.name === allTheThings[nextUnstruckIndex].category
          )].values.find((x) => x !== allTheThings[nextUnstruckIndex].option),
        struck:true
      }
    }
    lastIndexStruck = nextUnstruckIndex
  }
  
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
        v-for="(char) in titleOptions"
        :is="allTheOptionsAsAnArray().find((x) => x.option === char.option)?.struck ? 's' : 'span'"
      >
        {{ char.option }}
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
      <div id="result">
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
    top:45%;
  }
}

</style>
