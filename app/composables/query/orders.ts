import type { Order, CreateOrderDTO } from "../../../types";
import { API_ENDPOINTS } from "./api-endpoints";
import { getErrorMessage, getAuthHeaders } from "./helpers";

/**
 * Create a new order
 * Public endpoint - no authentication required
 * @param data - Order creation data
 * @returns Promise with success status and order data
 */
export const createOrderQuery = async (
  data: CreateOrderDTO,
): Promise<{ success: boolean; order?: Order; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; data: Order }>(
      API_ENDPOINTS.ORDERS,
      {
        method: "POST",
        body: data,
      },
    );

    return {
      success: true,
      order: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to create order"),
    };
  }
};

/**
 * Fetch all orders with optional status filter
 * Protected endpoint - requires authentication
 * @param status - Optional status filter (pending, verified, rejected)
 * @returns Promise with success status and orders array
 */
export const fetchOrdersQuery = async (
  status?: "pending" | "verified" | "rejected",
): Promise<{ success: boolean; orders?: Order[]; error?: string }> => {
  try {
    const headers = getAuthHeaders();
    const query = status ? `?status=${status}` : "";

    const response = await $fetch<{ success: boolean; data: Order[] }>(
      `${API_ENDPOINTS.ORDERS}${query}`,
      {
        method: "GET",
        headers,
      },
    );

    return {
      success: true,
      orders: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch orders"),
    };
  }
};

/**
 * Fetch a single order by ID
 * Public endpoint - no authentication required
 * @param id - Order ID
 * @returns Promise with success status and order data
 */
export const fetchOrderQuery = async (
  id: number,
): Promise<{ success: boolean; order?: Order; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; data: Order }>(
      API_ENDPOINTS.ORDER_BY_ID(id),
      {
        method: "GET",
      },
    );

    return {
      success: true,
      order: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch order"),
    };
  }
};

/**
 * Verify or reject an order payment
 * Protected endpoint - requires authentication
 * @param id - Order ID
 * @param status - Verification status (verified or rejected)
 * @returns Promise with success status and updated order
 */
export const verifyOrderQuery = async (
  id: number,
  status: "verified" | "rejected",
): Promise<{ success: boolean; order?: Order; error?: string }> => {
  try {
    const headers = getAuthHeaders();

    const response = await $fetch<{ success: boolean; data: Order }>(
      `${API_ENDPOINTS.ORDER_BY_ID(id)}/verify`,
      {
        method: "POST",
        headers,
        body: { status },
      },
    );

    return {
      success: true,
      order: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to verify order"),
    };
  }
};
