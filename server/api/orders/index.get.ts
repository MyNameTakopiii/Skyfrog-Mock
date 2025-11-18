import { db } from "../../db";
import { orders, products } from "../../db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "../../utils/jwt";
import {
  handleAuthError,
  handleBadRequestError,
  handleError,
} from "../../utils/errors";

/**
 * Get all orders (admin only)
 * Requires authentication and supports filtering by status
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

    // Get query parameters
    const query = getQuery(event);
    const statusFilter = query.status as string | undefined;

    // Validate status filter if provided
    if (
      statusFilter &&
      !["pending", "verified", "rejected"].includes(statusFilter)
    ) {
      handleBadRequestError(
        "Invalid status filter. Must be: pending, verified, or rejected",
      );
    }

    // Query orders with product details
    let allOrders = await db.query.orders.findMany({
      with: {
        product: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    // Apply status filter if provided
    if (statusFilter) {
      allOrders = allOrders.filter((order) => order.status === statusFilter);
    }

    // Parse OCR data from JSON string
    const ordersWithParsedOCR = allOrders.map((order) => ({
      ...order,
      ocrData: order.ocrData ? JSON.parse(order.ocrData) : null,
    }));

    return {
      success: true,
      data: ordersWithParsedOCR,
    };
  } catch (error) {
    console.error("Fetch orders error:", error);
    handleError(error, "Failed to fetch orders");
  }
});
