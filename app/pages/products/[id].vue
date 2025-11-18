<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isLoading" text="Loading product..." />

    <!-- Error Message -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <div
        class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg"
      >
        <p class="font-medium">Error loading product</p>
        <p class="text-sm">{{ error }}</p>
        <Button
          variant="secondary"
          size="md"
          class="mt-4"
          @click="navigateTo('/')"
        >
          Back to Products
        </Button>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="currentProduct" class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        class="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        @click="navigateTo('/')"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </button>

      <!-- Product Content -->
      <ProductDetailView
        :product="currentProduct"
        :is-loading="isGeneratingQR"
        @buy-now="handleBuyNow"
      />
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      v-model="showPaymentModal"
      :payment-data="paymentData"
      :order-created="orderCreated"
      :created-order-id="createdOrderId"
      :error="paymentError"
      :is-loading="isUploadingSlip"
      @submit="handleSubmitPayment"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import LoadingSpinner from "~/components/ui/LoadingSpinner.vue";
import Button from "~/components/ui/Button.vue";
import ProductDetailView from "~/components/product/ProductDetailView.vue";
import PaymentModal from "~/components/product/PaymentModal.vue";

// Get route params
const route = useRoute();
const productId = computed(() => Number(route.params.id));

// Use composables
const { currentProduct, isLoading, error, fetchProduct, clearCurrentProduct } =
  useProducts();
const {
  isGeneratingQR,
  isUploadingSlip,
  paymentError,
  paymentData,
  orderCreated,
  createdOrderId,
  generatePaymentQR,
  submitPayment,
  resetPayment,
} = usePayment();

// Component state
const showPaymentModal = ref(false);

/**
 * Fetch product on component mount
 */
onMounted(async () => {
  await fetchProduct(productId.value);
});

/**
 * Clear product data on unmount
 */
onUnmounted(() => {
  clearCurrentProduct();
});

/**
 * Handle Buy Now button click
 * Generate PromptPay QR code and show payment modal
 */
const handleBuyNow = async (quantity: number) => {
  if (!currentProduct.value) return;

  const result = await generatePaymentQR(currentProduct.value.id, quantity);

  if (result.success) {
    showPaymentModal.value = true;
  }
};

/**
 * Handle payment submission
 * Upload payment slip and create order
 */
const handleSubmitPayment = async (file: File) => {
  if (!paymentData.value || !currentProduct.value) return;

  await submitPayment(
    currentProduct.value.id,
    paymentData.value.quantity,
    file,
  );
};

/**
 * Close payment modal and reset state
 */
const closePaymentModal = () => {
  const wasOrderCreated = orderCreated.value;
  showPaymentModal.value = false;

  // Reset state after modal closes
  setTimeout(() => {
    resetPayment();

    // If order was created, refresh the product to update stock
    if (wasOrderCreated) {
      fetchProduct(productId.value);
    }
  }, 300);
};
</script>
