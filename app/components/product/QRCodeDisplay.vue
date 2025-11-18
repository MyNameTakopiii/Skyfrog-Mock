<template>
  <div class="text-center">
    <p class="text-sm text-gray-600 mb-4">
      Scan this QR code with your banking app to complete payment
    </p>
    <div class="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
      <img :src="qrCode" alt="PromptPay QR Code" class="w-64 h-64 mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  qrCode: string;
}

defineProps<Props>();
</script>
