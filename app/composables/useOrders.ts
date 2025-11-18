import type { Order, CreateOrderDTO } from "../../types";
import {
  createOrderQuery,
  fetchOrdersQuery,
  fetchOrderQuery,
  verifyOrderQuery,
} from "./query/orders";

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

export const useOrders = () => {
  // Reactive state for orders
  const state = useState<OrdersState>("orders", () => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  }));

  /**
   * Create a new order
   * Public endpoint - no authentication required
   * @param data - Order creation data
   * @returns Promise with success status and created order
   */
  const createOrder = async (
    data: CreateOrderDTO,
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await createOrderQuery(data);

    if (result.success && result.order) {
      state.value.currentOrder = result.order;
      state.value.isLoading = false;
      return { success: true, order: result.order };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to create order";
    return { success: false, error: result.error };
  };

  /**
   * Fetch all orders with optional status filter
   * Protected endpoint - requires authentication
   * @param status - Optional status filter (pending, verified, rejected)
   * @returns Promise with success status
   */
  const fetchOrders = async (
    status?: "pending" | "verified" | "rejected",
  ): Promise<{ success: boolean; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await fetchOrdersQuery(status);

    if (result.success && result.orders) {
      state.value.orders = result.orders;
      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to fetch orders";
    return { success: false, error: result.error };
  };

  /**
   * Fetch a single order by ID
   * Public endpoint - no authentication required
   * @param id - Order ID
   * @returns Promise with success status
   */
  const fetchOrder = async (
    id: number,
  ): Promise<{ success: boolean; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await fetchOrderQuery(id);

    if (result.success && result.order) {
      state.value.currentOrder = result.order;
      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to fetch order";
    return { success: false, error: result.error };
  };

  /**
   * Verify or reject an order payment
   * Protected endpoint - requires authentication
   * @param id - Order ID
   * @param status - Verification status (verified or rejected)
   * @returns Promise with success status and updated order
   */
  const verifyOrder = async (
    id: number,
    status: "verified" | "rejected",
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await verifyOrderQuery(id, status);

    if (result.success && result.order) {
      // Update the order in the orders list
      const index = state.value.orders.findIndex((o) => o.id === id);
      if (index !== -1) {
        state.value.orders[index] = result.order;
      }

      // Update current order if it's the one being verified
      if (state.value.currentOrder?.id === id) {
        state.value.currentOrder = result.order;
      }

      state.value.isLoading = false;
      return { success: true, order: result.order };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to verify order";
    return { success: false, error: result.error };
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    state.value.error = null;
  };

  /**
   * Clear current order
   */
  const clearCurrentOrder = () => {
    state.value.currentOrder = null;
  };

  return {
    // State
    orders: computed(() => state.value.orders),
    currentOrder: computed(() => state.value.currentOrder),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),

    // Methods
    createOrder,
    fetchOrders,
    fetchOrder,
    verifyOrder,
    clearError,
    clearCurrentOrder,
  };
};
