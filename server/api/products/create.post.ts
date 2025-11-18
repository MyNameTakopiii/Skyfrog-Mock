import { z } from "zod";
import { db } from "../../db";
import { products } from "../../db/schema";

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.string().min(1),
  stock: z.number().int().min(0).default(0),
});

/**
 * POST /api/products/create
 * สร้างสินค้าใหม่ (ต้อง login เป็นพ่อค้า)
 */
export default defineEventHandler(async (event) => {
  // middleware จะเช็ค auth แล้ว
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "กรุณา login",
    });
  }

  try {
    const body = await readBody(event);
    const data = createProductSchema.parse(body);

    const [newProduct] = await db
      .insert(products)
      .values({
        sellerId: parseInt(user.id),
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        stock: data.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      success: true,
      product: newProduct,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "ข้อมูลไม่ถูกต้อง",
      });
    }
    throw createError({
      statusCode: 500,
      message: "เกิดข้อผิดพลาด",
    });
  }
});
