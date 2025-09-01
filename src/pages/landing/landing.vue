<script setup lang="ts">
import type { CurrentPage } from '../../types';
import { Pages } from '../../types';

defineProps<{
    currentPage: CurrentPage
}>()
defineEmits<{
    (e: 'update:currentPage', value: CurrentPage): void
}>()

</script>

<template>
    <transition name="fade">
      <div
        id="landing"
        v-if="currentPage === Pages.Landing"
      >
        <button 
          id="start-button"
          @mouseup="$emit('update:currentPage', Pages.CategorySelecting)"
        >
          Start
        </button>
      </div>
    </transition>
</template>

<style scoped>

.fade-enter-active{
  transition: opacity 0.25s 1s ease;
}
.fade-leave-active{
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
#start-button{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
}
</style>