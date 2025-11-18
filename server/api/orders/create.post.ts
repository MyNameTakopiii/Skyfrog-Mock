import { z } from "zod";
import { db } from "../../db";
import { orders, products } from "../../db/schema";
import { eq } from "drizzle-orm";

const createOrderSchema = z.object({
  productId: z.number().int().positive(),
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
  paymentSlipUrl: z.string().min(1).optional(),
});

/**
 * POST /api/orders/create
 * สร้างออเดอร์ (Guest สั่งซื้อได้เลย ไม่ต้อง login)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = createOrderSchema.parse(body);

    // เช็คว่าสินค้ามีอยู่จริง
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, data.productId))
      .limit(1);

    if (!product) {
      throw createError({
        statusCode: 404,
        message: "ไม่พบสินค้า",
      });
    }

    // เช็ค stock
    if (product.stock < data.quantity) {
      throw createError({
        statusCode: 400,
        message: "สินค้าไม่เพียงพอ",
      });
    }

    const totalAmount = product.price * data.quantity;

    // สร้างออเดอร์
    const [newOrder] = await db
      .insert(orders)
      .values({
        productId: data.productId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        quantity: data.quantity,
        totalAmount,
        paymentSlipUrl: data.paymentSlipUrl,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    // ลด stock
    await db
      .update(products)
      .set({ stock: product.stock - data.quantity })
      .where(eq(products.id, data.productId));

    return {
      success: true,
      order: newOrder,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: "ข้อมูลไม่ถูกต้อง",
      });
    }
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "เกิดข้อผิดพลาด",
    });
  }
});
