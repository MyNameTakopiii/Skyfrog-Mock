<template>
  <Modal v-model="isOpen" :close-on-backdrop="false" size="large">
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900">
        {{ order?.status === "pending" ? "Verify Payment" : "Order Details" }}
      </h2>
    </template>

    <div v-if="order" class="space-y-6">
      <!-- Order Summary -->
      <OrderSummary :order="order" />

      <!-- Payment Slip Image -->
      <PaymentSlipSection
        v-if="order.paymentSlipUrl"
        :order="order"
        :ocr-data="ocrData"
        :is-processing="isProcessingOCR"
        @process-ocr="handleProcessOCR"
      />

      <!-- OCR Processing -->
      <OCRProcessing v-if="isProcessingOCR" />

      <!-- OCR Data Display -->
      <OCRDataDisplay
        v-if="ocrData || order.ocrData"
        :ocr-data="ocrData || order.ocrData"
      />

      <!-- Status Display (for non-pending orders) -->
      <OrderStatusDisplay v-if="order.status !== 'pending'" :order="order" />

      <!-- Action Buttons -->
      <div
        v-if="order.status === 'pending' && order.paymentSlipUrl"
        class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
      >
        <Button
          variant="secondary"
          :disabled="isVerifying"
          @click="handleClose"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          :loading="isVerifying && verificationAction === 'rejected'"
          :disabled="isVerifying"
          @click="handleVerification('rejected')"
        >
          Reject Payment
        </Button>
        <Button
          variant="primary"
          :loading="isVerifying && verificationAction === 'verified'"
          :disabled="isVerifying"
          @click="handleVerification('verified')"
        >
          Approve Payment
        </Button>
      </div>

      <!-- Close Button (for non-pending orders) -->
      <div v-else class="flex justify-end pt-4 border-t border-gray-200">
        <Button variant="secondary" @click="handleClose"> Close </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Order, OCRData } from "../../../types";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import OrderSummary from "./OrderSummary.vue";
import PaymentSlipSection from "./PaymentSlipSection.vue";
import OCRProcessing from "./OCRProcessing.vue";
import OCRDataDisplay from "./OCRDataDisplay.vue";
import OrderStatusDisplay from "./OrderStatusDisplay.vue";

interface Props {
  modelValue: boolean;
  order: Order | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  verify: [orderId: number, status: "verified" | "rejected"];
}>();

const isOpen = ref(props.modelValue);
const isVerifying = ref(false);
const isProcessingOCR = ref(false);
const verificationAction = ref<"verified" | "rejected" | null>(null);
const ocrData = ref<OCRData | null>(null);

watch(
  () => props.modelValue,
  (value) => {
    isOpen.value = value;
    if (!value) {
      // Reset state when modal closes
      ocrData.value = null;
      verificationAction.value = null;
    }
  },
);

watch(isOpen, (value) => {
  emit("update:modelValue", value);
});

const handleClose = () => {
  isOpen.value = false;
};

const handleProcessOCR = async () => {
  if (!props.order?.paymentSlipUrl) return;

  isProcessingOCR.value = true;

  try {
    const response = await $fetch<{ success: boolean; data: OCRData }>(
      "/api/payment/ocr",
      {
        method: "POST",
        body: {
          imageUrl: props.order.paymentSlipUrl,
        },
      },
    );

    if (response.success && response.data) {
      ocrData.value = response.data;
    } else {
      alert("Failed to process payment slip");
    }
  } catch (error) {
    console.error("OCR processing error:", error);
    alert("Failed to process payment slip");
  } finally {
    isProcessingOCR.value = false;
  }
};

const handleVerification = async (status: "verified" | "rejected") => {
  if (!props.order) return;

  isVerifying.value = true;
  verificationAction.value = status;

  try {
    emit("verify", props.order.id, status);
  } finally {
    isVerifying.value = false;
    verificationAction.value = null;
  }
};
</script>
