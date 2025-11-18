import { ref } from "vue";

interface PaymentData {
  qrCode: string;
  orderId: number;
  productName: string;
  quantity: number;
  totalAmount: number;
}

interface QRResponse {
  success: boolean;
  data?: {
    qrCode: string;
    orderId: number;
    productName: string;
    totalAmount: number;
  };
}

interface UploadResponse {
  success: boolean;
  data?: {
    imageUrl: string;
  };
}

export const usePayment = () => {
  const isGeneratingQR = ref(false);
  const isUploadingSlip = ref(false);
  const paymentError = ref<string | null>(null);
  const paymentData = ref<PaymentData | null>(null);
  const orderCreated = ref(false);
  const createdOrderId = ref<number | null>(null);

  /**
   * Generate QR code for payment
   * @param productId - Product ID to purchase
   * @param quantity - Quantity to purchase
   * @returns Promise with success status and payment data
   */
  const generatePaymentQR = async (
    productId: number,
    quantity: number,
  ): Promise<{ success: boolean; data?: PaymentData; error?: string }> => {
    isGeneratingQR.value = true;
    paymentError.value = null;

    try {
      const response = await $fetch<QRResponse>("/api/payment/qr", {
        method: "POST",
        body: {
          productId,
          quantity,
        },
      });

      if (response?.success && response.data) {
        const data: PaymentData = {
          qrCode: response.data.qrCode,
          orderId: response.data.orderId,
          productName: response.data.productName,
          quantity,
          totalAmount: response.data.totalAmount,
        };

        paymentData.value = data;
        return { success: true, data };
      }

      return { success: false, error: "Failed to generate QR code" };
    } catch (err: unknown) {
      console.error("QR generation error:", err);
      const error = err as { data?: { message?: string } };
      const errorMessage =
        error.data?.message || "Failed to generate payment QR code";
      paymentError.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isGeneratingQR.value = false;
    }
  };

  /**
   * Convert file to base64 string
   * @param file - File to convert
   * @returns Promise with base64 string
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
   * Upload payment slip image
   * @param file - Image file to upload
   * @returns Promise with success status and image URL
   */
  const uploadPaymentSlip = async (
    file: File,
  ): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
    try {
      // Convert file to base64
      const base64Image = await fileToBase64(file);

      // Upload image to Cloudinary
      const response = await $fetch<UploadResponse>("/api/upload/image", {
        method: "POST",
        body: {
          image: base64Image,
        },
      });

      if (!response?.success || !response.data?.imageUrl) {
        return { success: false, error: "Failed to upload payment slip" };
      }

      return { success: true, imageUrl: response.data.imageUrl };
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error.data?.message || error.message || "Failed to upload image";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Submit payment with slip
   * @param productId - Product ID
   * @param quantity - Quantity purchased
   * @param file - Payment slip image file
   * @returns Promise with success status and order ID
   */
  const submitPayment = async (
    productId: number,
    quantity: number,
    file: File,
  ): Promise<{ success: boolean; orderId?: number; error?: string }> => {
    isUploadingSlip.value = true;
    paymentError.value = null;

    try {
      // Upload payment slip
      const uploadResult = await uploadPaymentSlip(file);

      if (!uploadResult.success || !uploadResult.imageUrl) {
        throw new Error(uploadResult.error || "Failed to upload payment slip");
      }

      // Create order with payment slip
      const { createOrder } = useOrders();
      const orderResult = await createOrder({
        productId,
        quantity,
        paymentSlipUrl: uploadResult.imageUrl,
      });

      if (orderResult.success && orderResult.order) {
        orderCreated.value = true;
        createdOrderId.value = orderResult.order.id;
        return { success: true, orderId: orderResult.order.id };
      }

      throw new Error(orderResult.error || "Failed to create order");
    } catch (err: unknown) {
      console.error("Payment submission error:", err);
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error.data?.message || error.message || "Failed to submit payment";
      paymentError.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isUploadingSlip.value = false;
    }
  };

  /**
   * Reset payment state
   */
  const resetPayment = () => {
    paymentData.value = null;
    paymentError.value = null;
    orderCreated.value = false;
    createdOrderId.value = null;
    isGeneratingQR.value = false;
    isUploadingSlip.value = false;
  };

  return {
    // State
    isGeneratingQR: computed(() => isGeneratingQR.value),
    isUploadingSlip: computed(() => isUploadingSlip.value),
    paymentError: computed(() => paymentError.value),
    paymentData: computed(() => paymentData.value),
    orderCreated: computed(() => orderCreated.value),
    createdOrderId: computed(() => createdOrderId.value),

    // Methods
    generatePaymentQR,
    uploadPaymentSlip,
    submitPayment,
    resetPayment,
  };
};
