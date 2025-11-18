import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

const registerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().min(1),
  password: z.string().min(8).max(100),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "เบอร์โทรศัพท์ต้องเป็นเลข 10 หลัก เริ่มต้นด้วย 0"),
});

/**
 * POST /api/auth/register
 * สมัครสมาชิกเพื่อเป็นพ่อค้า (ประกาศขายของ)
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = registerSchema.parse(body);

    // เช็คว่า email ซ้ำไหม
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      throw createError({
        statusCode: 400,
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // สร้างผู้ใช้ใหม่
    const [newUser] = await db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        createdAt: new Date(),
      })
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        createdAt: users.createdAt,
      });

    return {
      success: true,
      user: newUser,
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
