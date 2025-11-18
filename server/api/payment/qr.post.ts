import { db } from "../../db";
import { products, orders, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { generatePromptPayQR } from "../../utils/promptpay";
import {
  handleBadRequestError,
  handleNotFoundError,
  handleServerError,
  handleError,
} from "../../utils/errors";

/**
 * Generate PromptPay QR code for product purchase
 * Creates a pending order and returns QR code for payment
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { productId, quantity = 1 } = body;

    // Validate input
    if (!productId || typeof productId !== "number") {
      handleBadRequestError("Product ID is required and must be a number");
    }

    if (quantity < 1) {
      handleBadRequestError("Quantity must be at least 1");
    }

    // Fetch product from database
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      handleNotFoundError("Product not found");
      return; // TypeScript guard
    }

    // Fetch seller's phone number
    const [seller] = await db
      .select({ phone: users.phone })
      .from(users)
      .where(eq(users.id, product.sellerId))
      .limit(1);

    if (!seller || !seller.phone) {
      handleServerError("Seller phone number not found");
      return; // TypeScript guard
    }

    // Check stock availability
    if (product.stock < quantity) {
      handleBadRequestError(`Insufficient stock. Available: ${product.stock}`);
    }

    // Calculate total amount
    const totalAmount = product.price * quantity;

    // Generate PromptPay QR code using seller's phone number
    const qrCodeDataURL = await generatePromptPayQR(seller.phone, totalAmount);

    // Create pending order in database
    const [order] = await db
      .insert(orders)
      .values({
        productId,
        quantity,
        totalAmount,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    // Return QR code and order details
    return {
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        orderId: order.id,
        productName: product.name,
        quantity,
        totalAmount,
      },
    };
  } catch (error) {
    console.error("QR generation error:", error);
    handleError(error, "Failed to generate payment QR code");
  }
});
