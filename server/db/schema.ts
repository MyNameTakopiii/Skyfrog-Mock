import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Users table for sellers
 * Stores authentication and profile information for sellers who can list products
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  phone: text("phone").notNull(), // Phone number for PromptPay QR code
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/**
 * Products table
 * Stores product catalog information
 */
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sellerId: integer("seller_id")
    .notNull()
    .references(() => users.id), // Product owner
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/**
 * Orders table
 * Stores order information including payment verification status
 */
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: real("total_amount").notNull(),
  paymentSlipUrl: text("payment_slip_url"),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  ocrData: text("ocr_data"), // JSON string of extracted OCR data
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),
  verifiedBy: integer("verified_by").references(() => users.id),
});
