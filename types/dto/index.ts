/**
 * Data Transfer Objects (DTOs) for API requests and responses
 */

/**
 * DTO for creating a new product
 */
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

/**
 * DTO for updating an existing product
 */
export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  stock?: number;
}

/**
 * DTO for creating a new order
 */
export interface CreateOrderDTO {
  productId: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  quantity: number;
  paymentSlipUrl?: string;
}

/**
 * DTO for verifying an order payment
 */
export interface VerifyOrderDTO {
  orderId: number;
  status: "verified" | "rejected";
}

/**
 * DTO for user registration
 */
export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * DTO for user login
 */
export interface LoginUserDTO {
  email: string;
  password: string;
}
