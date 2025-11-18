import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "../../utils/jwt";

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

/**
 * POST /api/auth/login
 * Login สำหรับพ่อค้า - คืน JWT token
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const data = loginSchema.parse(body);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    // สร้าง JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
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
