import { db } from "../../../db";
import { orders } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "../../../utils/jwt";
import {
  handleAuthError,
  handleBadRequestError,
  handleNotFoundError,
  handleError,
} from "../../../utils/errors";

/**
 * Verify or reject order payment (admin only)
 * Updates order status and records verification details
 */
export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const authHeader = getHeader(event, "authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      handleAuthError("Authentication required");
    }

    const payload = verifyToken(token);
    if (!payload) {
      handleAuthError("Invalid token");
    }

    // Get order ID from route params
    const id = event.context.params?.id;
    if (!id) {
      handleBadRequestError("Order ID is required");
    }

    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      handleBadRequestError("Invalid order ID");
    }

    // Get request body
    const body = await readBody(event);
    const { status } = body;

    // Validate status
    if (!status || !["verified", "rejected"].includes(status)) {
      handleBadRequestError('Status must be either "verified" or "rejected"');
    }

    // Check if order exists
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!existingOrder) {
      handleNotFoundError("Order not found");
    }

    // Check if order is already verified or rejected
    if (existingOrder.status !== "pending") {
      handleBadRequestError(`Order is already ${existingOrder.status}`);
    }

    // Update order status
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status,
        verifiedAt: new Date(),
        verifiedBy: payload.userId,
      })
      .where(eq(orders.id, orderId))
      .returning();

    // Parse OCR data if available
    const orderWithParsedOCR = {
      ...updatedOrder,
      ocrData: updatedOrder.ocrData ? JSON.parse(updatedOrder.ocrData) : null,
    };

    return {
      success: true,
      data: orderWithParsedOCR,
      message: `Order ${status} successfully`,
    };
  } catch (error) {
    console.error("Order verification error:", error);
    handleError(error, "Failed to verify order");
  }
});
