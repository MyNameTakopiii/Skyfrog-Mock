<template>
  <div>
    <h3 class="text-sm font-semibold text-gray-700 mb-3">Payment Slip</h3>
    <div class="relative">
      <img
        :src="order.paymentSlipUrl"
        alt="Payment slip"
        class="w-full rounded-lg border border-gray-200 max-h-96 object-contain bg-gray-50"
      />
      <button
        v-if="order.status === 'pending' && !isProcessing && !ocrData"
        class="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center"
        @click="$emit('process-ocr')"
      >
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
        Extract Data (OCR)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OCRData } from "../../../types";

interface Props {
  order: Order;
  ocrData: OCRData | null;
  isProcessing: boolean;
}

defineProps<Props>();

defineEmits<{
  "process-ocr": [];
}>();
</script>
