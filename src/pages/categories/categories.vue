<script setup lang="ts">
import { ref } from 'vue';
import { defaultCategories } from '../../categories';
import { Pages, type Category, type CurrentPage } from '../../types';

//This section is already starting to repeat- need to DRY this
defineProps<{
    currentPage: CurrentPage
}>()
defineEmits<{
    (e: 'update:currentPage', value: CurrentPage): void,
    (e: 'update:selectedCategories', value: Category[]): void
}>()

const categories = ref([...defaultCategories])

const handleChangeInput = (e: Event, categoryId: number, valueIndex: number) => {
    const categoryIndex = categories.value.findIndex(x => x.id === categoryId)
    categories.value[categoryIndex].values[valueIndex] = (e.target as HTMLInputElement).value
}

const allCategoriesFilled = () => {
    for (let i in categories.value) {
        if (categories.value[i].values.length < 3) return false
        for (let x in categories.value[i].values) {
            if (categories.value[i].values[x] === "") return false
        }
    }
    return true
}
const enoughCategoriesSelected = () => {
    return categories.value.filter(x => x.selected).length >= 4
}

const handleAddCategory = () => {
    const newCategory = {
        id: categories.value.length + 1,
        name: "",
        values: [],
        selected: true,
        isCustom: true
    }
    categories.value.push(newCategory)
}


</script>

<template>
    <transition name="fade">
        <div 
            id="category-selecting" 
            v-if="currentPage === Pages.CategorySelecting"
        >
            <h2>Select Categories</h2>
            <div class="category-container" v-for="category in categories">
                <h3>
                    <input 
                        type="checkbox"
                        :checked="category.selected"     
                        @click="category.selected = !category.selected"
                        v-if="category.isCustom !== true"
                    />
                    <input
                        type="text"
                        :value="category.name"
                        :disabled="category.isCustom !== true"
                        @change="e => category.name = (e.target as HTMLInputElement).value"
                    />
                </h3>
                <ul :id="`${category.name}-values`" class="category-values">
                    <li v-for="value, index in category.values" :key="value">
                        <input 
                            type="text" 
                            :value="value"
                            @change="e => handleChangeInput(e, category.id, index)"
                        />
                    </li>
                    <button 
                        v-if="category.values.length < 4"
                        @click="category.values.push('')"
                    >+</button>
                </ul>
            </div>
            <button
                @click="handleAddCategory()"
            >
                + Add Category
            </button>
            <button
                v-on:click="
                    $emit('update:selectedCategories', categories),
                    $emit('update:currentPage', Pages.Landing)
                "
            >
                Back <
            </button>
            <button
                :disabled="!enoughCategoriesSelected() || !allCategoriesFilled()"
                v-on:click="
                    $emit('update:selectedCategories', categories),
                    $emit('update:currentPage', Pages.MagicNumberSelecting)
                "
            >
                > Next
            </button>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s 0.5s ease
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>