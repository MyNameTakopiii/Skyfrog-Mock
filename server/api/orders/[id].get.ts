import { db } from "../../db";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  handleBadRequestError,
  handleNotFoundError,
  handleError,
} from "../../utils/errors";

/**
 * Get single order by ID
 * Returns order with product details and OCR data if available
 */
export default defineEventHandler(async (event) => {
  try {
    // Get order ID from route params
    const id = event.context.params?.id;

    if (!id) {
      handleBadRequestError("Order ID is required");
    }

    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      handleBadRequestError("Invalid order ID");
    }

    // Query order with product details
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        product: true,
      },
    });

    if (!order) {
      handleNotFoundError("Order not found");
    }

    // Parse OCR data from JSON string
    const orderWithParsedOCR = {
      ...order,
      ocrData: order.ocrData ? JSON.parse(order.ocrData) : null,
    };

    return {
      success: true,
      data: orderWithParsedOCR,
    };
  } catch (error) {
    console.error("Fetch order error:", error);
    handleError(error, "Failed to fetch order");
  }
});
