<template>
  <footer class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Main footer content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand section -->
        <div>
          <h3 class="text-xl font-bold text-white mb-4">MockShop</h3>
          <p class="text-gray-400 text-sm">
            Your trusted e-commerce platform for seamless shopping with
            PromptPay payments.
          </p>
        </div>
      </div>

      <!-- Bottom bar with copyright -->
      <div class="mt-8 pt-8 border-t border-gray-700">
        <div
          class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p class="text-gray-400 text-sm text-center md:text-left">
            &copy; {{ currentYear }} MockShop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear());
</script>
