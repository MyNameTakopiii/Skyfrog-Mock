import { verifyToken } from "../../utils/jwt";

/**
 * GET /api/auth/me
 * ดูข้อมูลตัวเอง (ต้องส่ง token มา)
 */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "กรุณา login",
    });
  }

  const payload = verifyToken(token);

  if (!payload) {
    throw createError({
      statusCode: 401,
      message: "Token ไม่ถูกต้อง",
    });
  }

  return {
    success: true,
    user: {
      id: payload.userId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    },
  };
});
