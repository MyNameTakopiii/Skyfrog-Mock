import type { Product, CreateProductDTO, UpdateProductDTO } from "../../types";
import {
  fetchProductsQuery,
  fetchMyProductsQuery,
  fetchProductQuery,
  createProductQuery,
  updateProductQuery,
  deleteProductQuery,
} from "./query/products";

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

export const useProducts = () => {
  // Reactive state for products
  const state = useState<ProductsState>("products", () => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
  }));

  /**
   * Fetch all products from the API
   * Public endpoint - no authentication required
   * @returns Promise with success status
   */
  const fetchProducts = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await fetchProductsQuery();

    if (result.success && result.products) {
      state.value.products = result.products;
      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to fetch products";
    return { success: false, error: result.error };
  };

  /**
   * Fetch seller's own products from the API
   * Protected endpoint - requires authentication
   * @returns Promise with success status
   */
  const fetchMyProducts = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await fetchMyProductsQuery();

    if (result.success && result.products) {
      state.value.products = result.products;
      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to fetch your products";
    return { success: false, error: result.error };
  };

  /**
   * Fetch a single product by ID
   * Public endpoint - no authentication required
   * @param id - Product ID
   * @returns Promise with success status
   */
  const fetchProduct = async (
    id: number,
  ): Promise<{ success: boolean; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await fetchProductQuery(id);

    if (result.success && result.product) {
      state.value.currentProduct = result.product;
      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to fetch product";
    return { success: false, error: result.error };
  };

  /**
   * Create a new product
   * Protected endpoint - requires authentication
   * @param data - Product creation data
   * @returns Promise with success status and created product
   */
  const createProduct = async (
    data: CreateProductDTO,
  ): Promise<{ success: boolean; product?: Product; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await createProductQuery(data);

    if (result.success && result.product) {
      // Add the new product to the products list
      state.value.products.push(result.product);
      state.value.isLoading = false;
      return { success: true, product: result.product };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to create product";
    return { success: false, error: result.error };
  };

  /**
   * Update an existing product
   * Protected endpoint - requires authentication
   * @param id - Product ID
   * @param data - Product update data
   * @returns Promise with success status and updated product
   */
  const updateProduct = async (
    id: number,
    data: UpdateProductDTO,
  ): Promise<{ success: boolean; product?: Product; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await updateProductQuery(id, data);

    if (result.success && result.product) {
      // Update the product in the products list
      const index = state.value.products.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.value.products[index] = result.product;
      }

      // Update current product if it's the one being updated
      if (state.value.currentProduct?.id === id) {
        state.value.currentProduct = result.product;
      }

      state.value.isLoading = false;
      return { success: true, product: result.product };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to update product";
    return { success: false, error: result.error };
  };

  /**
   * Delete a product
   * Protected endpoint - requires authentication
   * @param id - Product ID
   * @returns Promise with success status
   */
  const deleteProduct = async (
    id: number,
  ): Promise<{ success: boolean; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await deleteProductQuery(id);

    if (result.success) {
      // Remove the product from the products list
      state.value.products = state.value.products.filter((p) => p.id !== id);

      // Clear current product if it's the one being deleted
      if (state.value.currentProduct?.id === id) {
        state.value.currentProduct = null;
      }

      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to delete product";
    return { success: false, error: result.error };
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    state.value.error = null;
  };

  /**
   * Clear current product
   */
  const clearCurrentProduct = () => {
    state.value.currentProduct = null;
  };

  return {
    // State
    products: computed(() => state.value.products),
    currentProduct: computed(() => state.value.currentProduct),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),

    // Methods
    fetchProducts,
    fetchMyProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    clearCurrentProduct,
  };
};
