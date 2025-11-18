import { db } from "../../db";
import { products } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  handleBadRequestError,
  handleNotFoundError,
  handleServerError,
} from "../../utils/errors";

/**
 * GET /api/products/[id]
 * Get a single product by ID
 * Public endpoint - no authentication required
 * ถ้า login แล้วจะเห็นได้เฉพาะสินค้าของตัวเอง
 * Requirements: 1.3
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");

  if (!id || isNaN(parseInt(id))) {
    handleBadRequestError("Invalid product ID");
    return;
  }

  const productId = parseInt(id);

  try {
    const [product] = await db
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
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      handleNotFoundError("Product not found");
    }

    // ถ้า login แล้ว ต้องเป็นเจ้าของสินค้าถึงจะดูได้
    if (user && product.sellerId !== parseInt(user.id)) {
      throw createError({
        statusCode: 403,
        message: "You don't have permission to view this product",
      });
    }

    return {
      success: true,
      product,
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      throw error;
    }
    handleServerError("Failed to fetch product");
  }
});
