<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <!-- Product Image -->
    <div class="aspect-square w-full overflow-hidden bg-gray-100">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Name -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Product Price -->
      <p class="text-2xl font-bold text-blue-600 mb-4">
        ฿{{ formatPrice(product.price) }}
      </p>

      <!-- View Details Button -->
      <Button
        variant="primary"
        size="md"
        class="w-full"
        @click="handleViewDetails"
      >
        View Details
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "../../../types";
import Button from "~/components/ui/Button.vue";
import { formatPrice } from "~/utils/formatters";

interface ProductCardProps {
  product: Product;
}

const props = defineProps<ProductCardProps>();

const emit = defineEmits<{
  viewDetails: [productId: number];
}>();

/**
 * Handle view details button click
 */
const handleViewDetails = () => {
  emit("viewDetails", props.product.id);
};
</script>

<style scoped>
/* Line clamp utility for truncating text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
