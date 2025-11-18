<template>
  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">Order Information</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-xs text-gray-500">Order ID</p>
        <p class="text-sm font-medium text-gray-900">#{{ order.id }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500">Total Amount</p>
        <p class="text-sm font-medium text-gray-900">
          ฿{{ formatPrice(order.totalAmount) }}
        </p>
      </div>
      <div>
        <p class="text-xs text-gray-500">Customer</p>
        <p class="text-sm font-medium text-gray-900">
          {{ order.customerName || "Guest" }}
        </p>
      </div>
      <div>
        <p class="text-xs text-gray-500">Date</p>
        <p class="text-sm font-medium text-gray-900">
          {{ formatDate(order.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "../../../types";
import { formatPrice, formatDate } from "~/utils/formatters";

interface Props {
  order: Order;
}

defineProps<Props>();
</script>
