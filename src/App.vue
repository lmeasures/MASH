<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { Category, CharacterBooleanMap, CurrentPage } from './types';
import Landing from './pages/landing/landing.vue';
import Categories from './pages/categories/categories.vue';

type TitleState = CharacterBooleanMap<typeof titleCharacters>

const currentPage: Ref<CurrentPage> = ref("landing")

const titleCharacters = "MASH"

/** Instantiate a blank TitleState object */
const titleState: TitleState = {}
/** 
 * Loop through the characters in titleCharacters, 
 * applying a 'default' false value to each character 
 */
titleCharacters.split("").forEach(char => titleState[char] = false)

const selectedCategories = ref<Category[]>([])

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

    <Landing 
      :currentPage="currentPage" 
      @update:currentPage="val => currentPage = val" 
    />

    <Categories 
      :currentPage="currentPage" 
      @update:currentPage="val => currentPage = val" 
      @update:selectedCategories="val => selectedCategories = val"
    />

    <div id="magic-number-selecting">
    </div>

    <div id="selection-summary">
    </div>

    <div id="result">
    </div>

  </div>
</template>

<style scoped>
#mash-title {
  position:absolute;
  transform:translate(-50%, -50%);
  transition: top 0.5s 0.4s ease;
  
  left:50%;
  font-size: 3em;
  &.position-landing {
    top:35%;
  }
  &.position-category-selecting {
    top:10%;
  }
  &.position-magic-number-selecting {
    top:45%;
  }
  &.position-selection-summary {
    top:45%;
  }
  &.position-result {
    top:45%;
  }
}

</style>
