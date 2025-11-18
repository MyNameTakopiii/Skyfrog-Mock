import { db } from "../../db";
import { products, users } from "../../db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/products/list
 * ดูรายการสินค้าทั้งหมด (Guest ดูได้)
 * ถ้า login แล้วจะเห็นเฉพาะสินค้าของตัวเอง
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user;

  // ถ้า login แล้ว แสดงเฉพาะสินค้าของตัวเอง
  if (user) {
    const myProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        stock: products.stock,
        createdAt: products.createdAt,
        sellerId: products.sellerId,
      })
      .from(products)
      .where(eq(products.sellerId, parseInt(user.id)));

    return {
      success: true,
      products: myProducts,
    };
  }

  // ถ้ายังไม่ login แสดงสินค้าทั้งหมด
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      imageUrl: products.imageUrl,
      stock: products.stock,
      createdAt: products.createdAt,
      seller: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
      },
    })
    .from(products)
    .leftJoin(users, eq(products.sellerId, users.id));

  return {
    success: true,
    products: allProducts,
  };
});
