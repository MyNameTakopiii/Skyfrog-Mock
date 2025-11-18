import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../../../types";
import { API_ENDPOINTS } from "./api-endpoints";
import { getAuthHeaders, getErrorMessage } from "./helpers";

/**
 * Fetch all products from the API (public)
 * Returns all products regardless of authentication
 */
export const fetchProductsQuery = async (): Promise<{
  success: boolean;
  products?: Product[];
  error?: string;
}> => {
  try {
    const response = await $fetch<{ success: boolean; products: Product[] }>(
      API_ENDPOINTS.PRODUCTS,
      {
        method: "GET",
      },
    );

    if (response.success && response.products) {
      return { success: true, products: response.products };
    }

    return { success: false, error: "Failed to fetch products" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch products"),
    };
  }
};

/**
 * Fetch seller's own products from the API
 * Protected endpoint - requires authentication
 */
export const fetchMyProductsQuery = async (): Promise<{
  success: boolean;
  products?: Product[];
  error?: string;
}> => {
  try {
    const response = await $fetch<{ success: boolean; products: Product[] }>(
      API_ENDPOINTS.PRODUCTS_ME,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    if (response.success && response.products) {
      return { success: true, products: response.products };
    }

    return { success: false, error: "Failed to fetch your products" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch your products"),
    };
  }
};

/**
 * Fetch a single product by ID
 * Public endpoint - no authentication required
 */
export const fetchProductQuery = async (
  id: number,
): Promise<{ success: boolean; product?: Product; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; product: Product }>(
      API_ENDPOINTS.PRODUCT_BY_ID(id),
      {
        method: "GET",
      },
    );

    if (response.success && response.product) {
      return { success: true, product: response.product };
    }

    return { success: false, error: "Failed to fetch product" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch product"),
    };
  }
};

/**
 * Create a new product
 * Protected endpoint - requires authentication
 */
export const createProductQuery = async (
  data: CreateProductDTO,
): Promise<{ success: boolean; product?: Product; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; product: Product }>(
      API_ENDPOINTS.PRODUCTS,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: data,
      },
    );

    if (response.success && response.product) {
      return { success: true, product: response.product };
    }

    return { success: false, error: "Failed to create product" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to create product"),
    };
  }
};

/**
 * Update an existing product
 * Protected endpoint - requires authentication
 */
export const updateProductQuery = async (
  id: number,
  data: UpdateProductDTO,
): Promise<{ success: boolean; product?: Product; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; product: Product }>(
      API_ENDPOINTS.PRODUCT_BY_ID(id),
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: data,
      },
    );

    if (response.success && response.product) {
      return { success: true, product: response.product };
    }

    return { success: false, error: "Failed to update product" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update product"),
    };
  }
};

/**
 * Delete a product
 * Protected endpoint - requires authentication
 */
export const deleteProductQuery = async (
  id: number,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; message: string }>(
      API_ENDPOINTS.PRODUCT_BY_ID(id),
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    if (response.success) {
      return { success: true };
    }

    return { success: false, error: "Failed to delete product" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete product"),
    };
  }
};
