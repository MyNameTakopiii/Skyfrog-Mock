<template>
  <Modal v-model="isOpen" :close-on-backdrop="false">
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900">Complete Your Payment</h2>
    </template>

    <div class="space-y-6">
      <!-- Order Summary -->
      <OrderSummary
        v-if="paymentData"
        :product-name="paymentData.productName"
        :quantity="paymentData.quantity"
        :total-amount="paymentData.totalAmount"
      />

      <!-- QR Code Display -->
      <QRCodeDisplay v-if="paymentData?.qrCode" :qr-code="paymentData.qrCode" />

      <!-- Payment Slip Upload -->
      <PaymentSlipUpload
        v-if="!orderCreated"
        v-model="selectedFile"
        @update:model-value="handleFileChange"
      />

      <!-- Success Message -->
      <div
        v-if="orderCreated"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
      >
        <p class="font-medium">Order created successfully!</p>
        <p class="text-sm">Your order ID is: {{ createdOrderId }}</p>
        <p class="text-sm mt-1">
          We will verify your payment and contact you soon.
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        <p class="font-medium">Error</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex space-x-3">
        <Button
          variant="secondary"
          size="md"
          class="flex-1"
          :disabled="isLoading"
          @click="handleClose"
        >
          {{ orderCreated ? "Close" : "Cancel" }}
        </Button>
        <Button
          v-if="!orderCreated"
          variant="primary"
          size="md"
          class="flex-1"
          :disabled="!selectedFile"
          :loading="isLoading"
          @click="handleSubmit"
        >
          Submit Payment
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import OrderSummary from "./OrderSummary.vue";
import QRCodeDisplay from "./QRCodeDisplay.vue";
import PaymentSlipUpload from "./PaymentSlipUpload.vue";

interface PaymentData {
  qrCode: string;
  orderId: number;
  productName: string;
  quantity: number;
  totalAmount: number;
}

interface Props {
  modelValue: boolean;
  paymentData: PaymentData | null;
  orderCreated: boolean;
  createdOrderId: number | null;
  error: string | null;
  isLoading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [file: File];
  close: [];
}>();

const isOpen = ref(props.modelValue);
const selectedFile = ref<File | null>(null);

watch(
  () => props.modelValue,
  (value) => {
    isOpen.value = value;
  },
);

watch(isOpen, (value) => {
  emit("update:modelValue", value);
  if (!value) {
    selectedFile.value = null;
  }
});

const handleFileChange = (file: File | null) => {
  selectedFile.value = file;
};

const handleSubmit = () => {
  if (selectedFile.value) {
    emit("submit", selectedFile.value);
  }
};

const handleClose = () => {
  isOpen.value = false;
  emit("close");
};
</script>
