<template>
  <div>
    <label class="block text-sm font-semibold text-gray-900 mb-2">
      Upload Payment Slip
    </label>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      @change="handleFileSelect"
    />
    <p class="mt-1 text-xs text-gray-500">
      Upload a screenshot or photo of your payment confirmation
    </p>

    <!-- Image Preview -->
    <div v-if="imagePreview" class="mt-4">
      <img
        :src="imagePreview"
        alt="Payment slip preview"
        class="w-full max-w-xs mx-auto rounded-lg border border-gray-200"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  modelValue: File | null;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [file: File | null];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string>("");

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    emit("update:modelValue", file);

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    emit("update:modelValue", null);
    imagePreview.value = "";
  }
};
</script>
