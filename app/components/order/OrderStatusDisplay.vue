<template>
  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold text-gray-700">Status</p>
        <span
          :class="[
            'mt-1 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
            order.status === 'verified'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
          ]"
        >
          {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
        </span>
      </div>
      <div v-if="order.verifiedAt" class="text-right">
        <p class="text-xs text-gray-500">Verified At</p>
        <p class="text-sm font-medium text-gray-900">
          {{ formatDate(order.verifiedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "../../../types";
import { formatDate } from "~/utils/formatters";

interface Props {
  order: Order;
}

defineProps<Props>();
</script>
