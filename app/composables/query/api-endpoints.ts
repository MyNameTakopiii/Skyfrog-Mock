export const API_ENDPOINTS = {
  // Products
  PRODUCTS: "/api/products",
  PRODUCTS_ME: "/api/products/me", // Seller's own products
  PRODUCT_BY_ID: (id: number) => `/api/products/${id}`,

  // Auth
  AUTH_LOGIN: "/api/auth/login",
  AUTH_REGISTER: "/api/auth/register",
  AUTH_ME: "/api/auth/me",

  // Orders
  ORDERS: "/api/orders",
  ORDER_BY_ID: (id: number) => `/api/orders/${id}`,

  // Payment
  PAYMENT_QR: "/api/payment/qr",
  PAYMENT_OCR: "/api/payment/ocr",
} as const;
