import { eq } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schema";
import { handleAuthError, handleServerError } from "../../utils/errors";

/**
 * GET /api/products/me
 * Get products owned by the authenticated seller
 * Protected endpoint - requires authentication
 */
export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;

    if (!user) {
      console.error("GET /api/products/me - User not authenticated");
      handleAuthError("Authentication required");
      return;
    }

    console.log(
      `GET /api/products/me - Fetching products for seller ID: ${user.id}`,
    );

    const sellerProducts = await db
      .select({
        id: products.id,
        sellerId: products.sellerId,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        stock: products.stock,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.sellerId, parseInt(user.id)));

    console.log(`Found ${sellerProducts.length} products for seller`);

    return {
      success: true,
      products: sellerProducts,
    };
  } catch (error) {
    console.error("Error fetching seller products:", error);
    handleServerError("Failed to fetch your products");
  }
});
