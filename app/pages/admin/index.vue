<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isLoading" text="Loading dashboard..." />

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {{ user?.firstName }}!
        </h1>
        <p class="text-gray-600">
          Manage your e-commerce platform from the admin dashboard
        </p>
      </div>

      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <!-- Product Management Card -->
        <NuxtLink
          to="/admin/products"
          class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-500"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"
              >
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                Product Management
              </h2>
              <p class="text-gray-600">
                Create, edit, and delete products in your catalog
              </p>
              <div class="mt-4 flex items-center text-blue-600 font-medium">
                <span>Manage Products</span>
                <svg
                  class="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Order Verification Card -->
        <NuxtLink
          to="/admin/orders"
          class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-green-500"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white"
              >
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                Order Verification
              </h2>
              <p class="text-gray-600">
                Review and verify customer payment slips
              </p>
              <div class="mt-4 flex items-center text-green-600 font-medium">
                <span>Verify Orders</span>
                <svg
                  class="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Quick Stats (Optional Enhancement) -->
      <div class="mt-8 max-w-4xl">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          Quick Overview
        </h2>
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <p class="text-gray-600">
            Use the cards above to navigate to product management or order
            verification sections.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import LoadingSpinner from "~/components/ui/LoadingSpinner.vue";

// Set page meta for protected route
definePageMeta({
  middleware: "auth",
});

// Composables
const { user, isAuthenticated, fetchCurrentUser } = useCustomAuth();
const router = useRouter();

// Loading state
const isLoading = ref(true);

/**
 * Initialize dashboard - verify authentication
 */
onMounted(async () => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated.value) {
      // Redirect to login if not authenticated
      await router.push("/auth/login");
      return;
    }

    // Fetch current user data to ensure token is valid
    const result = await fetchCurrentUser();

    if (!result.success) {
      // If token is invalid, redirect to login
      await router.push("/auth/login");
      return;
    }
  } catch (error) {
    console.error("Dashboard initialization error:", error);
    await router.push("/auth/login");
  } finally {
    isLoading.value = false;
  }
});
</script>
