<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <h3 class="font-semibold text-gray-900 mb-2">Order Summary</h3>
    <div class="space-y-1 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-600">Product:</span>
        <span class="font-medium">{{ productName }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Quantity:</span>
        <span class="font-medium">{{ quantity }}</span>
      </div>
      <div
        class="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t border-gray-200"
      >
        <span>Total:</span>
        <span>฿{{ formatPrice(totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from "~/utils/formatters";

interface Props {
  productName: string;
  quantity: number;
  totalAmount: number;
}

defineProps<Props>();
</script>
