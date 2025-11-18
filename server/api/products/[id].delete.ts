import { db } from "../../db";
import { products } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  handleAuthError,
  handleBadRequestError,
  handleNotFoundError,
  handleServerError,
} from "../../utils/errors";

/**
 * DELETE /api/products/[id]
 * Delete a product
 * Protected endpoint - requires authentication
 * Requirements: 5.6
 */
export default defineEventHandler(async (event) => {
  // Check if user is authenticated (middleware should set this)
  const user = event.context.user;

  if (!user) {
    handleAuthError();
  }

  const id = getRouterParam(event, "id");

  if (!id || isNaN(parseInt(id))) {
    handleBadRequestError("Invalid product ID");
    return;
  }

  const productId = parseInt(id);

  try {
    // Check if product exists
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!existingProduct) {
      handleNotFoundError("Product not found");
    }

    // Check if user owns this product
    if (existingProduct.sellerId !== parseInt(user.id)) {
      throw createError({
        statusCode: 403,
        message: "You don't have permission to delete this product",
      });
    }

    // Delete the product
    await db.delete(products).where(eq(products.id, productId));

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      throw error;
    }
    handleServerError("Failed to delete product");
  }
});
