<script setup lang="ts">
import { ref } from 'vue';
import { defaultCategories } from '../../categories';
import { type Category } from '../../types';

//This section is already starting to repeat- need to DRY this
const emit = defineEmits<{
    (e: 'update:selectedCategories', value: Category[]): void
}>()

const categories = ref([...defaultCategories])

const handleChangeInput = (e: Event, categoryId: number, valueIndex: number) => {
    const categoryIndex = categories.value.findIndex(x => x.id === categoryId)
    categories.value[categoryIndex].values[valueIndex] = (e.target as HTMLInputElement).value
    emit('update:selectedCategories', categories.value)
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
        <div 
            id="category-selecting" 
        >
            <h2>Categories</h2>
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
        </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s 0.5s ease
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>