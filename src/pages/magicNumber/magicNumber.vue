<script setup lang="ts">
import { ref } from 'vue';
import { Pages, type CurrentPage } from '../../types';

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
    if(stop){
        timeoutId && timeoutId.value && clearInterval(timeoutId.value)
        emit('update:magicNumber', magicNumber.value)
    }
}

</script>

<template>
        <div 
            id="magic-number-selecting" 
        >
            <h2>Magic Number</h2>
            <div class="magic-number-container">
                <label for="magic-number-value" v-if="currentPage === Pages.SelectionSummary">Magic Number</label>
                <input id="magic-number-value" disabled :value="magicNumber"/>
                <button 
                    v-if="currentPage !== Pages.SelectionSummary"
                    @mousedown="generateMagicNumber({start:true})"
                    @mouseup="generateMagicNumber({stop:true})"
                >Generate a Magic Number!</button>
            </div>

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