<template>
  <tr class="hover:bg-gray-50 transition-colors">
    <!-- Order ID -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
    </td>

    <!-- Product Info -->
    <td class="px-6 py-4">
      <div class="flex items-center">
        <div v-if="order.product" class="flex-shrink-0 h-12 w-12">
          <img
            :src="order.product.imageUrl"
            :alt="order.product.name"
            class="h-12 w-12 rounded-lg object-cover border border-gray-200"
          />
        </div>
        <div class="ml-3">
          <div class="text-sm font-medium text-gray-900">
            {{ order.product?.name || "Unknown Product" }}
          </div>
          <div class="text-sm text-gray-500">Qty: {{ order.quantity }}</div>
        </div>
      </div>
    </td>

    <!-- Customer Info -->
    <td class="px-6 py-4">
      <div class="text-sm text-gray-900">
        {{ order.customerName || "Guest" }}
      </div>
      <div v-if="order.customerEmail" class="text-sm text-gray-500">
        {{ order.customerEmail }}
      </div>
      <div v-if="order.customerPhone" class="text-sm text-gray-500">
        {{ order.customerPhone }}
      </div>
    </td>

    <!-- Amount -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">
        ฿{{ formatPrice(order.totalAmount) }}
      </div>
    </td>

    <!-- Payment Slip Thumbnail -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div v-if="order.paymentSlipUrl" class="flex items-center">
        <img
          :src="order.paymentSlipUrl"
          alt="Payment slip"
          class="h-16 w-16 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
          @click="$emit('view', order)"
        />
      </div>
      <div v-else class="text-sm text-gray-400">No slip uploaded</div>
    </td>

    <!-- Status -->
    <td class="px-6 py-4 whitespace-nowrap">
      <span
        :class="[
          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
          order.status === 'verified'
            ? 'bg-green-100 text-green-800'
            : order.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800',
        ]"
      >
        {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
      </span>
    </td>

    <!-- Date -->
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ formatDate(order.createdAt) }}
    </td>

    <!-- Actions -->
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        v-if="order.status === 'pending' && order.paymentSlipUrl"
        class="text-blue-600 hover:text-blue-900 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
        @click="$emit('view', order)"
      >
        Verify
      </button>
      <button
        v-else-if="order.status !== 'pending'"
        class="text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 rounded-lg hover:bg-gray-50"
        @click="$emit('view', order)"
      >
        View
      </button>
      <span v-else class="text-gray-400"> Awaiting slip </span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Order } from "../../../types";
import { formatPrice, formatDate } from "~/utils/formatters";

interface Props {
  order: Order;
}

defineProps<Props>();

defineEmits<{
  view: [order: Order];
}>();
</script>
