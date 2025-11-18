<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="grid md:grid-cols-2 gap-8 p-6 md:p-8">
      <!-- Product Image -->
      <div class="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ product.name }}
        </h1>

        <p class="text-4xl font-bold text-blue-600 mb-6">
          ฿{{ formatPrice(product.price) }}
        </p>

        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="mb-6">
          <p class="text-sm text-gray-600">
            <span class="font-semibold">Stock:</span>
            <span :class="stockClass">{{ product.stock }} available</span>
          </p>
        </div>

        <!-- Quantity Selector -->
        <QuantitySelector
          v-model="quantity"
          :max="product.stock"
          class="mb-6"
        />

        <!-- Buy Now Button -->
        <Button
          variant="primary"
          size="lg"
          class="w-full"
          :disabled="product.stock === 0"
          :loading="isLoading"
          @click="handleBuyNow"
        >
          {{ product.stock === 0 ? "Out of Stock" : "Buy Now" }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "../../../types";
import { formatPrice } from "~/utils/formatters";
import Button from "~/components/ui/Button.vue";
import QuantitySelector from "./QuantitySelector.vue";

interface Props {
  product: Product;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<{
  "buy-now": [quantity: number];
}>();

const quantity = ref(1);

const stockClass = computed(() => {
  const stock = props.product.stock;
  if (stock === 0) return "text-red-600 ml-2";
  if (stock < 10) return "text-orange-600 ml-2";
  return "text-green-600 ml-2";
});

const handleBuyNow = () => {
  emit("buy-now", quantity.value);
};
</script>
