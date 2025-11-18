<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        ></div>

        <!-- Modal content -->
        <div
          :class="[
            'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col',
            sizeClasses,
          ]"
          @click.stop
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-1"
            @click="close"
            aria-label="Close modal"
          >
            <svg
              class="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Header slot -->
          <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
            <slot name="header" />
          </div>

          <!-- Body slot -->
          <div class="px-6 py-4 overflow-y-auto flex-1">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ModalProps {
  modelValue: boolean;
  closeOnBackdrop?: boolean;
  size?: "small" | "medium" | "large" | "xlarge";
}

const props = withDefaults(defineProps<ModalProps>(), {
  closeOnBackdrop: true,
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case "small":
      return "max-w-md";
    case "medium":
      return "max-w-lg";
    case "large":
      return "max-w-2xl";
    case "xlarge":
      return "max-w-4xl";
    default:
      return "max-w-lg";
  }
});

const close = () => {
  emit("update:modelValue", false);
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close();
  }
};
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
