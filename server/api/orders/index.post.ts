import { db } from "../../db";
import { products, orders } from "../../db/schema";
import { eq } from "drizzle-orm";
import type { CreateOrderDTO } from "../../../types";
import {
  handleBadRequestError,
  handleNotFoundError,
  handleError,
} from "../../utils/errors";

/**
 * Create a new order
 * Validates product availability and creates order with pending status
 */
export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as CreateOrderDTO;
    const { productId, customerName, customerEmail, customerPhone, quantity } =
      body;

    // Validate required fields
    if (!productId || typeof productId !== "number") {
      handleBadRequestError("Product ID is required and must be a number");
    }

    if (!quantity || quantity < 1) {
      handleBadRequestError("Quantity must be at least 1");
    }

    // Fetch product from database
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      handleNotFoundError("Product not found");
    }

    // Check stock availability
    if (product.stock < quantity) {
      handleBadRequestError(
        `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    // Calculate total amount
    const totalAmount = product.price * quantity;

    // Create order with pending status
    const [order] = await db
      .insert(orders)
      .values({
        productId,
        customerName: customerName || null,
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
        quantity,
        totalAmount,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    // Return order details
    return {
      success: true,
      data: {
        id: order.id,
        productId: order.productId,
        productName: product.name,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    };
  } catch (error) {
    console.error("Order creation error:", error);
    handleError(error, "Failed to create order");
  }
});
