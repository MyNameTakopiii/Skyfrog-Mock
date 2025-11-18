<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :class="[
          'w-full px-4 py-2.5 text-sm border rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
          error
            ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'hover:border-gray-400',
        ]"
        @input="handleInput"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface InputProps {
  modelValue?: string | number;
  type?: "text" | "email" | "password" | "number" | "url" | "tel";
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  modelValue: "",
  label: "",
  placeholder: "",
  error: "",
  hint: "",
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [];
  focus: [];
}>();

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === "number" ? Number(target.value) : target.value;
  emit("update:modelValue", value);
};
</script>
