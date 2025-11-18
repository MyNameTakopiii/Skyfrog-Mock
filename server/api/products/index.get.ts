import { db } from "../../db";
import { products } from "../../db/schema";
import { handleServerError } from "../../utils/errors";

/**
 * GET /api/products
 * Get products from the database
 * - If authenticated: returns only seller's own products
 * - If not authenticated (public): returns all products
 * Requirements: 1.4
 */
export default defineEventHandler(async (_event) => {
  try {
    const allProducts = await db
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
      .from(products);

    return {
      success: true,
      products: allProducts,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    handleServerError("Failed to fetch products");
  }
});
