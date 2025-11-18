import { z } from "zod";
import { db } from "../../db";
import { products } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  handleAuthError,
  handleBadRequestError,
  handleNotFoundError,
  handleError,
} from "../../utils/errors";

/**
 * Zod schema for validating product update input
 * All fields are optional for partial updates
 */
const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name is too long")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().positive("Price must be positive").optional(),
  imageUrl: z.string().min(1, "Image URL is required").optional(),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),
});

/**
 * PUT /api/products/[id]
 * Update an existing product
 * Protected endpoint - requires authentication
 * Requirements: 5.5
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
    const body = await readBody(event);
    const validatedData = updateProductSchema.parse(body);

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
        message: "You don't have permission to edit this product",
      });
    }

    // Update product with new timestamp
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    return {
      success: true,
      product: updatedProduct,
    };
  } catch (error: unknown) {
    handleError(error, "Failed to update product");
  }
});
