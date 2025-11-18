<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="flex flex-col items-center">
      <!-- Spinner animation -->
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
      ></div>

      <!-- Optional loading text -->
      <p v-if="text" class="mt-4 text-white text-lg font-medium">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoadingSpinnerProps {
  text?: string;
}

withDefaults(defineProps<LoadingSpinnerProps>(), {
  text: "",
});
</script>
