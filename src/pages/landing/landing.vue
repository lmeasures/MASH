<script setup lang="ts">
import type { CurrentPage } from '../../types';

defineProps<{
    currentPage: CurrentPage
}>()
defineEmits<{
    (e: 'update:currentPage', value: CurrentPage): void
}>()

</script>

<template>
    <transition name="fade">
      <div id="landing" v-if="currentPage === 'landing'">
        <button 
          id="start-button"
          v-on:click="$emit('update:currentPage', 'category-selecting')"
        >
          Start
        </button>
      </div>
    </transition>
</template>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>