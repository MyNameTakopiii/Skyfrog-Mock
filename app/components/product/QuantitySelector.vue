<template>
  <div>
    <label
      for="quantity"
      class="block text-sm font-semibold text-gray-900 mb-2"
    >
      Quantity
    </label>
    <div class="flex items-center space-x-4">
      <button
        type="button"
        class="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="modelValue <= 1"
        @click="decrement"
      >
        <span class="text-xl">−</span>
      </button>

      <input
        id="quantity"
        :value="modelValue"
        type="number"
        min="1"
        :max="max"
        class="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="handleInput"
      />

      <button
        type="button"
        class="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="modelValue >= max"
        @click="increment"
      >
        <span class="text-xl">+</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number;
  max: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const increment = () => {
  if (props.modelValue < props.max) {
    emit("update:modelValue", props.modelValue + 1);
  }
};

const decrement = () => {
  if (props.modelValue > 1) {
    emit("update:modelValue", props.modelValue - 1);
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 1;
  const clampedValue = Math.max(1, Math.min(value, props.max));
  emit("update:modelValue", clampedValue);
};
</script>
