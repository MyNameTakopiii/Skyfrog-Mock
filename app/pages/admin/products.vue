<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isInitialLoading" text="Loading products..." />

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p class="text-gray-600">
            Create, edit, and delete products in your catalog
          </p>
        </div>
        <Button variant="primary" @click="openCreateModal">
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Product
        </Button>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Empty State -->
        <div v-if="products.length === 0" class="text-center py-12 px-4">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No products yet
          </h3>
          <p class="text-gray-600 mb-4">
            Get started by creating your first product
          </p>
          <Button variant="primary" @click="openCreateModal">
            Create Product
          </Button>
        </div>

        <!-- Products Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="product in products"
                :key="product.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Product Info -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-16 w-16">
                      <img
                        :src="product.imageUrl"
                        :alt="product.name"
                        class="h-16 w-16 rounded-lg object-cover border border-gray-200"
                      >
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ product.name }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Description -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ product.description }}
                  </div>
                </td>

                <!-- Price -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    ฿{{ formatPrice(product.price) }}
                  </div>
                </td>

                <!-- Stock -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ product.stock }} units
                  </span>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(product.createdAt) }}
                </td>

                <!-- Actions -->
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <div class="flex justify-end space-x-2">
                    <button
                      class="text-blue-600 hover:text-blue-900 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
                      @click="openEditModal(product)"
                    >
                      Edit
                    </button>
                    <button
                      class="text-red-600 hover:text-red-900 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                      @click="openDeleteConfirmation(product)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <Modal v-model="showProductModal" :close-on-backdrop="false" size="large">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ modalMode === "create" ? "Create New Product" : "Edit Product" }}
        </h2>
      </template>

      <ProductForm
        :mode="modalMode"
        :product="selectedProduct"
        @submit="handleProductSubmit"
        @cancel="closeProductModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" size="small">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900">Delete Product</h2>
      </template>

      <div v-if="productToDelete" class="space-y-4">
        <!-- Warning Message -->
        <div class="bg-red-50 rounded-lg p-4 border border-red-200">
          <div class="flex">
            <svg
              class="h-5 w-5 text-red-400 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Warning</h3>
              <p class="mt-1 text-sm text-red-700">
                This action cannot be undone. This will permanently delete the
                product.
              </p>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-center">
            <img
              :src="productToDelete.imageUrl"
              :alt="productToDelete.name"
              class="h-16 w-16 rounded-lg object-cover border border-gray-200"
            >
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">
                {{ productToDelete.name }}
              </p>
              <p class="text-sm text-gray-500">
                ฿{{ formatPrice(productToDelete.price) }} •
                {{ productToDelete.stock }} units in stock
              </p>
            </div>
          </div>
        </div>

        <!-- Confirmation Text -->
        <p class="text-sm text-gray-600">
          Are you sure you want to delete this product?
        </p>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            :disabled="isDeleting"
            @click="closeDeleteModal"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            Delete Product
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../../../types";
import { formatPrice, formatDateShort as formatDate } from "~/utils/formatters";
import { useCustomAuth } from "~/composables/useAuth";
import LoadingSpinner from "~/components/ui/LoadingSpinner.vue";
import Button from "~/components/ui/Button.vue";
import Modal from "~/components/ui/Modal.vue";
import ProductForm from "~/components/product/ProductForm.vue";

// Set page meta for protected route
definePageMeta({
  middleware: "auth",
});

// Composables
const auth = useCustomAuth();
const { products, fetchMyProducts, createProduct, updateProduct, deleteProduct } =
  useProducts();
const router = useRouter();

// Loading states
const isInitialLoading = ref(true);
const isDeleting = ref(false);

// Modal states
const showProductModal = ref(false);
const showDeleteModal = ref(false);
const modalMode = ref<"create" | "edit">("create");
const selectedProduct = ref<Product | undefined>(undefined);
const productToDelete = ref<Product | null>(null);

/**
 * Open create product modal
 */
const openCreateModal = () => {
  modalMode.value = "create";
  selectedProduct.value = undefined;
  showProductModal.value = true;
};

/**
 * Open edit product modal
 */
const openEditModal = (product: Product) => {
  modalMode.value = "edit";
  selectedProduct.value = product;
  showProductModal.value = true;
};

/**
 * Close product modal
 */
const closeProductModal = () => {
  showProductModal.value = false;
  selectedProduct.value = undefined;
};

/**
 * Handle product form submission
 */
const handleProductSubmit = async (
  data: CreateProductDTO | UpdateProductDTO,
) => {
  try {
    let result;

    if (modalMode.value === "create") {
      result = await createProduct(data as CreateProductDTO);
    } else if (selectedProduct.value) {
      result = await updateProduct(
        selectedProduct.value.id,
        data as UpdateProductDTO,
      );
    }

    if (result?.success) {
      closeProductModal();
      console.log(
        `Product ${modalMode.value === "create" ? "created" : "updated"} successfully`,
      );
    } else {
      alert(result?.error || `Failed to ${modalMode.value} product`);
    }
  } catch (error) {
    console.error("Product submission error:", error);
    alert("An unexpected error occurred");
  }
};

/**
 * Open delete confirmation modal
 */
const openDeleteConfirmation = (product: Product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

/**
 * Close delete modal
 */
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

/**
 * Handle product deletion
 */
const handleDelete = async () => {
  if (!productToDelete.value) return;

  isDeleting.value = true;

  try {
    const result = await deleteProduct(productToDelete.value.id);

    if (result.success) {
      closeDeleteModal();
      console.log("Product deleted successfully");
    } else {
      alert(result.error || "Failed to delete product");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("An unexpected error occurred");
  } finally {
    isDeleting.value = false;
  }
};

/**
 * Initialize page - verify authentication and load products
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

    // Fetch seller's own products
    await fetchMyProducts();
  } catch (error) {
    console.error("Page initialization error:", error);
    await router.push("/auth/login");
  } finally {
    isInitialLoading.value = false;
  }
});
</script>
