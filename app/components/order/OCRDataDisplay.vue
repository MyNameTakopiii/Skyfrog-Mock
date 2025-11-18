<template>
  <div class="bg-green-50 rounded-lg p-4 border border-green-200">
    <h3 class="text-sm font-semibold text-green-900 mb-3 flex items-center">
      <svg
        class="w-5 h-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Extracted Payment Information
    </h3>
    <div class="grid grid-cols-2 gap-4">
      <div v-if="ocrData?.amount">
        <p class="text-xs text-green-700">Amount</p>
        <p class="text-sm font-medium text-green-900">{{ ocrData.amount }}</p>
      </div>
      <div v-if="ocrData?.date">
        <p class="text-xs text-green-700">Date</p>
        <p class="text-sm font-medium text-green-900">{{ ocrData.date }}</p>
      </div>
      <div v-if="ocrData?.reference" class="col-span-2">
        <p class="text-xs text-green-700">Reference</p>
        <p class="text-sm font-medium text-green-900">
          {{ ocrData.reference }}
        </p>
      </div>
    </div>

    <!-- Raw Text (Collapsible) -->
    <div class="mt-4">
      <button
        class="text-xs text-green-700 hover:text-green-900 font-medium flex items-center"
        @click="showRawText = !showRawText"
      >
        <svg
          :class="[
            'w-4 h-4 mr-1 transition-transform',
            showRawText ? 'rotate-90' : '',
          ]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        {{ showRawText ? "Hide" : "Show" }} Raw Text
      </button>
      <div
        v-if="showRawText"
        class="mt-2 bg-white rounded p-3 text-xs text-gray-700 font-mono max-h-32 overflow-y-auto"
      >
        {{ ocrData?.rawText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { OCRData } from "../../../types";

interface Props {
  ocrData: OCRData | null;
}

defineProps<Props>();

const showRawText = ref(false);
</script>

<style scoped>
/* Custom scrollbar for raw text */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
