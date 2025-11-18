<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isLoading" text="Loading products..." />

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p class="text-gray-600">Browse our collection of amazing products</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        <p class="font-medium">Error loading products</p>
        <p class="text-sm">{{ error }}</p>
      </div>

      <!-- Product Grid -->
      <ProductGrid :products="products" @view-details="handleViewDetails" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductGrid from "~/components/product/ProductGrid.vue";
import LoadingSpinner from "~/components/ui/LoadingSpinner.vue";

// Use the products composable
const { products, isLoading, error, fetchProducts } = useProducts();

// Fetch products on component mount
onMounted(async () => {
  await fetchProducts();
});

/**
 * Handle view details event - navigate to product detail page
 */
const handleViewDetails = (productId: number) => {
  navigateTo(`/products/${productId}`);
};
</script>
