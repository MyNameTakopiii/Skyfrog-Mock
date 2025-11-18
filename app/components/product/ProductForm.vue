<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Product Name -->
    <div>
      <label
        for="product-name"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Product Name <span class="text-red-500">*</span>
      </label>
      <Input
        id="product-name"
        v-model="formData.name"
        type="text"
        placeholder="Enter product name"
        required
        :error="errors.name"
        @blur="validateField('name')"
      />
    </div>

    <!-- Product Description -->
    <div>
      <label
        for="product-description"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Description <span class="text-red-500">*</span>
      </label>
      <textarea
        id="product-description"
        v-model="formData.description"
        placeholder="Enter product description"
        required
        rows="4"
        :class="textareaClasses"
        @blur="validateField('description')"
      />
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">
        {{ errors.description }}
      </p>
    </div>

    <!-- Price and Stock Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Product Price -->
      <div>
        <label
          for="product-price"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Price (฿) <span class="text-red-500">*</span>
        </label>
        <Input
          id="product-price"
          v-model="formData.price"
          type="number"
          placeholder="0.00"
          required
          :error="errors.price"
          @blur="validateField('price')"
        />
      </div>

      <!-- Product Stock -->
      <div>
        <label
          for="product-stock"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Stock <span class="text-red-500">*</span>
        </label>
        <Input
          id="product-stock"
          v-model="formData.stock"
          type="number"
          placeholder="0"
          required
          :error="errors.stock"
          @blur="validateField('stock')"
        />
      </div>
    </div>

    <!-- Image Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Product Image <span class="text-red-500">*</span>
      </label>

      <!-- Image Preview -->
      <div v-if="imagePreview" class="mb-4">
        <div class="relative w-full max-w-xs mx-auto">
          <img
            :src="imagePreview"
            alt="Product preview"
            class="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Remove image"
            @click="removeImage"
          >
            <svg
              class="w-4 h-4"
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
        </div>
      </div>

      <!-- File Input -->
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
        :class="{ 'border-red-500': errors.imageUrl }"
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
        />

        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p class="mt-2 text-sm text-gray-600">
          <span class="font-medium text-blue-600">Click to upload</span> or drag
          and drop
        </p>
        <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>

      <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">
        {{ errors.imageUrl }}
      </p>

      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
        <p class="text-sm text-gray-600 mt-1 text-center">
          Uploading... {{ uploadProgress }}%
        </p>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <Button
        type="button"
        variant="secondary"
        :disabled="loading"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading || !isFormValid"
      >
        {{ mode === "create" ? "Create Product" : "Update Product" }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../../../types";
import Input from "~/components/ui/Input.vue";
import Button from "~/components/ui/Button.vue";

interface ProductFormProps {
  mode?: "create" | "edit";
  product?: Product;
}

const props = withDefaults(defineProps<ProductFormProps>(), {
  mode: "create",
  product: undefined,
});

const emit = defineEmits<{
  submit: [data: CreateProductDTO | UpdateProductDTO];
  cancel: [];
}>();

// Form data
const formData = reactive({
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrl: "",
});

// Form state
const loading = ref(false);
const uploadProgress = ref(0);
const imagePreview = ref<string>("");
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);

// Validation errors
const errors = reactive({
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
});

/**
 * Textarea classes with validation state
 */
const textareaClasses = computed(() => {
  const baseClasses =
    "w-full px-4 py-2 text-base border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none";
  const stateClasses = errors.description
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return `${baseClasses} ${stateClasses}`;
});

/**
 * Check if form is valid
 */
const isFormValid = computed(() => {
  return (
    formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.price > 0 &&
    formData.stock >= 0 &&
    formData.imageUrl !== "" &&
    !Object.values(errors).some((error) => error !== "")
  );
});

/**
 * Validate individual field
 */
const validateField = (field: keyof typeof formData) => {
  errors[field] = "";

  switch (field) {
    case "name":
      if (!formData.name.trim()) {
        errors.name = "Product name is required";
      } else if (formData.name.length < 3) {
        errors.name = "Product name must be at least 3 characters";
      } else if (formData.name.length > 100) {
        errors.name = "Product name must not exceed 100 characters";
      }
      break;

    case "description":
      if (!formData.description.trim()) {
        errors.description = "Description is required";
      } else if (formData.description.length < 10) {
        errors.description = "Description must be at least 10 characters";
      } else if (formData.description.length > 1000) {
        errors.description = "Description must not exceed 1000 characters";
      }
      break;

    case "price":
      if (formData.price <= 0) {
        errors.price = "Price must be greater than 0";
      } else if (formData.price > 1000000) {
        errors.price = "Price must not exceed 1,000,000";
      }
      break;

    case "stock":
      if (formData.stock < 0) {
        errors.stock = "Stock cannot be negative";
      } else if (formData.stock > 100000) {
        errors.stock = "Stock must not exceed 100,000";
      }
      break;

    case "imageUrl":
      if (!formData.imageUrl) {
        errors.imageUrl = "Product image is required";
      }
      break;
  }
};

/**
 * Validate all fields
 */
const validateForm = (): boolean => {
  validateField("name");
  validateField("description");
  validateField("price");
  validateField("stock");
  validateField("imageUrl");

  return isFormValid.value;
};

/**
 * Trigger file input click
 */
const triggerFileInput = () => {
  fileInput.value?.click();
};

/**
 * Handle file selection
 */
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    await processFile(file);
  }
};

/**
 * Handle drag over
 */
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

/**
 * Handle drag leave
 */
const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
};

/**
 * Handle file drop
 */
const handleDrop = async (event: DragEvent) => {
  event.preventDefault();

  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    await processFile(file);
  }
};

/**
 * Process selected file
 */
const processFile = async (file: File) => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    errors.imageUrl = "Please select a valid image file";
    return;
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    errors.imageUrl = "Image size must not exceed 10MB";
    return;
  }

  selectedFile.value = file;
  errors.imageUrl = "";

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  // Upload to server
  await uploadImage(file);
};

/**
 * Upload image to Cloudinary
 */
const uploadImage = async (file: File) => {
  try {
    loading.value = true;
    uploadProgress.value = 0;

    // Convert file to base64
    const base64 = await fileToBase64(file);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 100);

    // Upload to server
    const response = await $fetch<{
      success: boolean;
      data: { imageUrl: string };
    }>("/api/upload/image", {
      method: "POST",
      body: { image: base64 },
    });

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Set image URL
    if (response?.success && response.data?.imageUrl) {
      formData.imageUrl = response.data.imageUrl;
      errors.imageUrl = "";
    }

    // Reset progress after a short delay
    setTimeout(() => {
      uploadProgress.value = 0;
    }, 1000);
  } catch (error) {
    console.error("Image upload failed:", error);
    errors.imageUrl = "Failed to upload image. Please try again.";
    imagePreview.value = "";
    selectedFile.value = null;
  } finally {
    loading.value = false;
  }
};

/**
 * Convert file to base64
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Remove selected image
 */
const removeImage = () => {
  imagePreview.value = "";
  formData.imageUrl = "";
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  errors.imageUrl = "Product image is required";
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const productData: CreateProductDTO | UpdateProductDTO = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      imageUrl: formData.imageUrl,
    };

    emit("submit", productData);
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    loading.value = false;
  }
};

/**
 * Handle cancel
 */
const handleCancel = () => {
  emit("cancel");
};

/**
 * Initialize form with product data in edit mode
 */
const initializeForm = () => {
  if (props.mode === "edit" && props.product) {
    formData.name = props.product.name;
    formData.description = props.product.description;
    formData.price = props.product.price;
    formData.stock = props.product.stock;
    formData.imageUrl = props.product.imageUrl;
    imagePreview.value = props.product.imageUrl;
  }
};

// Watch for product changes in edit mode
watch(
  () => props.product,
  () => {
    if (props.mode === "edit") {
      initializeForm();
    }
  },
  { deep: true },
);

// Initialize form on mount
onMounted(() => {
  initializeForm();
});
</script>
