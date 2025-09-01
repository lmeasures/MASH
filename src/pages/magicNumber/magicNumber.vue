<script setup lang="ts">
import { ref } from 'vue';
import { Pages, type CurrentPage } from '../../types';

//This section is already starting to repeat- need to DRY this
defineProps<{
    currentPage: CurrentPage
}>()
const emit = defineEmits<{
    (e: 'update:currentPage', value: CurrentPage): void,
    (e: 'update:magicNumber', value: number): void
}>()

const magicNumber = ref<number>(0)
const timeoutId = ref<number | null>(null)

const generateMagicNumber = ({start, stop}:{start?:boolean,stop?:boolean}) => {
    if(start)
        timeoutId.value = setInterval(()=>{
            magicNumber.value = Math.floor(Math.random() * (9 - 3 + 1)) + 3
        },45)
    if(stop)
        timeoutId && timeoutId.value && clearInterval(timeoutId.value)
}

</script>

<template>
    <transition name="fade">
        <div 
            id="category-selecting" 
            v-if="currentPage === Pages.MagicNumberSelecting"
        >
            <h2>Generate a Magic Number</h2>
            <div class="magic-number-container">
                <input disabled :value="magicNumber"/>
                <button 
                    @mousedown="generateMagicNumber({start:true})"
                    @mouseup="generateMagicNumber({stop:true})"
                >Generate a Magic Number!</button>
            </div>

            <button
                v-on:click="
                    $emit('update:magicNumber', magicNumber),
                    $emit('update:currentPage', Pages.CategorySelecting)
                "
            >
                Back <
            </button>
            <button
                :disabled="magicNumber === 0"
                v-on:click="
                    $emit('update:magicNumber', magicNumber),
                    $emit('update:currentPage', Pages.SelectionSummary)
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