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
  console.log("Running MASH Algorithm with:");
  console.log("Selected Categories:", selectedCategories.value);
  console.log("Magic Number:", magicNumber.value);
  currentPage.value = Pages.Result;
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
        v-for="(char, index) in Object.keys(titleState)" :key="index"
        :is="titleState[char] ? 's' : 'span'"
      >
        {{ char }}
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
