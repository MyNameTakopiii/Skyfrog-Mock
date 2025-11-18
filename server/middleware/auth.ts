import { verifyToken } from "../utils/jwt";

/**
 * Middleware สำหรับ route ที่ต้อง login (เฉพาะพ่อค้า)
 */
export default defineEventHandler(async (event) => {
  const path = event.path;

  // Route ที่ต้อง login
  const protectedRoutes = [
    "/api/products/create",
    "/api/products/update",
    "/api/products/delete",
    "/api/orders/verify",
  ];

  // Check for POST, PUT, DELETE methods on /api/products
  const isProductMutation =
    path.startsWith("/api/products") &&
    (event.method === "POST" ||
      event.method === "PUT" ||
      event.method === "DELETE");

  // Check for GET /api/products/me (seller's own products)
  const isProductsMe = path === "/api/products/me" && event.method === "GET";

  // Check for GET method on /api/orders (admin only)
  const isOrdersGet = path === "/api/orders" && event.method === "GET";

  // Check for verify endpoint
  const isOrderVerify =
    path.includes("/api/orders/") && path.includes("/verify");

  const isProtected =
    protectedRoutes.some((route) => path.startsWith(route)) ||
    isProductMutation ||
    isProductsMe ||
    isOrdersGet ||
    isOrderVerify;

  // No optional auth needed anymore
  const isOptionalAuth = false;

  if (isProtected || isOptionalAuth) {
    const authHeader = getHeader(event, "authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      // For protected routes, throw error
      if (isProtected) {
        throw createError({
          statusCode: 401,
          message: "กรุณา login",
        });
      }
      // For optional auth, just continue without user context
      return;
    }

    const payload = verifyToken(token);

    if (!payload) {
      // For protected routes, throw error
      if (isProtected) {
        throw createError({
          statusCode: 401,
          message: "Token ไม่ถูกต้อง",
        });
      }
      // For optional auth, just continue without user context
      return;
    }

    // เพิ่ม user ลง context
    event.context.user = {
      id: payload.userId.toString(),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
});
