import { z } from "zod";
import { db } from "../../db";
import { products } from "../../db/schema";
import { handleAuthError, handleError } from "../../utils/errors";

/**
 * Zod schema for validating product creation input
 */
const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().min(1, "Image URL is required"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .default(0),
});

/**
 * POST /api/products
 * Create a new product
 * Protected endpoint - requires authentication
 * Requirements: 5.2, 5.4
 */
export default defineEventHandler(async (event) => {
  // Check if user is authenticated (middleware should set this)
  const user = event.context.user;

  if (!user) {
    console.error("Product creation failed: User not authenticated");
    handleAuthError();
  }

  try {
    const body = await readBody(event);
    console.log("Creating product with data:", {
      ...body,
      imageUrl: body.imageUrl?.substring(0, 50) + "...",
    });

    const validatedData = createProductSchema.parse(body);

    const [newProduct] = await db
      .insert(products)
      .values({
        sellerId: parseInt(user.id),
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl,
        stock: validatedData.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log("Product created successfully:", newProduct.id);

    return {
      success: true,
      product: newProduct,
    };
  } catch (error: unknown) {
    console.error("Product creation error:", error);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    handleError(error, "Failed to create product");
  }
});
