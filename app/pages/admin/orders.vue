<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isInitialLoading" text="Loading orders..." />

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Order Verification
        </h1>
        <p class="text-gray-600">Review and verify customer payment slips</p>
      </div>

      <!-- Filters -->
      <OrderFilters
        :filters="filters"
        :current-filter="currentFilter"
        @change="setStatusFilter"
      />

      <!-- Orders Table -->
      <OrdersTable
        :orders="filteredOrders"
        :filter-label="currentFilter === 'all' ? '' : currentFilter"
        :empty-message="
          currentFilter === 'pending'
            ? 'All orders have been processed'
            : 'No orders match this filter'
        "
        @view="openVerificationModal"
      />
    </div>

    <!-- Verification Modal -->
    <OrderVerificationModal
      v-model="showVerificationModal"
      :order="selectedOrder"
      @verify="handleVerification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Order } from "../../../types";
import { useCustomAuth } from "~/composables/useAuth";
import LoadingSpinner from "~/components/ui/LoadingSpinner.vue";
import OrderFilters from "~/components/order/OrderFilters.vue";
import OrdersTable from "~/components/order/OrdersTable.vue";
import OrderVerificationModal from "~/components/order/OrderVerificationModal.vue";

// Set page meta for protected route
definePageMeta({
  middleware: "auth",
});

// Composables
const auth = useCustomAuth();
const { orders, fetchOrders, verifyOrder } = useOrders();
const router = useRouter();

// Loading states
const isInitialLoading = ref(true);

// Modal states
const showVerificationModal = ref(false);
const selectedOrder = ref<Order | null>(null);

// Filter state
const currentFilter = ref<"all" | "pending" | "verified" | "rejected">("all");

/**
 * Filter configuration
 */
const filters = computed(() => {
  const allOrders = orders.value;
  return [
    {
      label: "All Orders",
      value: "all" as const,
      count: allOrders.length,
    },
    {
      label: "Pending",
      value: "pending" as const,
      count: allOrders.filter((o) => o.status === "pending").length,
    },
    {
      label: "Verified",
      value: "verified" as const,
      count: allOrders.filter((o) => o.status === "verified").length,
    },
    {
      label: "Rejected",
      value: "rejected" as const,
      count: allOrders.filter((o) => o.status === "rejected").length,
    },
  ];
});

/**
 * Filtered orders based on current filter
 */
const filteredOrders = computed(() => {
  if (currentFilter.value === "all") {
    return orders.value;
  }
  return orders.value.filter((order) => order.status === currentFilter.value);
});

/**
 * Set status filter
 */
const setStatusFilter = async (
  filter: "all" | "pending" | "verified" | "rejected",
) => {
  currentFilter.value = filter;
  // Optionally refetch with filter
  if (filter === "all") {
    await fetchOrders();
  } else {
    await fetchOrders(filter);
  }
};

/**
 * Open verification modal
 */
const openVerificationModal = (order: Order) => {
  selectedOrder.value = order;
  showVerificationModal.value = true;
};

/**
 * Handle order verification (approve/reject)
 */
const handleVerification = async (
  orderId: number,
  status: "verified" | "rejected",
) => {
  try {
    const result = await verifyOrder(orderId, status);

    if (result.success) {
      showVerificationModal.value = false;
      selectedOrder.value = null;
      console.log(`Order ${status} successfully`);
    } else {
      console.error("Failed to verify order:", result.error);
      alert(result.error || "Failed to verify order");
    }
  } catch (error) {
    console.error("Verification error:", error);
    alert("An unexpected error occurred");
  }
};

/**
 * Initialize page - verify authentication and load orders
 */
onMounted(async () => {
  try {
    // Check if user is authenticated
    if (!auth.isAuthenticated.value) {
      await router.push("/auth/login");
      return;
    }

    // Fetch current user to verify token
    const userResult = await auth.fetchCurrentUser();
    if (!userResult.success) {
      await router.push("/auth/login");
      return;
    }

    // Fetch all orders
    await fetchOrders();
  } catch (error) {
    console.error("Page initialization error:", error);
    await router.push("/auth/login");
  } finally {
    isInitialLoading.value = false;
  }
});
</script>
