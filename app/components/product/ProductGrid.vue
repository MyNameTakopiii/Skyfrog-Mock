<template>
  <div>
    <!-- Empty State -->
    <UEmpty
      v-if="products.length === 0"
      icon="i-heroicons-shopping-bag"
      title="No Products Available"
      :description="emptyMessage"
      class="py-16"
    />

    <!-- Product Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @view-details="handleViewDetails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "../../../types";
import ProductCard from "~/components/product/ProductCard.vue";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

withDefaults(defineProps<ProductGridProps>(), {
  emptyMessage:
    "There are no products to display at the moment. Please check back later.",
});

const emit = defineEmits<{
  viewDetails: [productId: number];
}>();

/**
 * Handle view details event from ProductCard
 */
const handleViewDetails = (productId: number) => {
  emit("viewDetails", productId);
};
</script>
