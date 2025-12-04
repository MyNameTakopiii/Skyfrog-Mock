import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

/**
 * Users table for sellers
 * Stores authentication and profile information for sellers who can list products
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  phone: text("phone").notNull(), // Phone number for PromptPay QR code
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Products table
 * Stores product catalog information
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id")
    .notNull()
    .references(() => users.id), // Product owner
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Orders table
 * Stores order information including payment verification status
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentSlipUrl: text("payment_slip_url"),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  ocrData: text("ocr_data"), // JSON string of extracted OCR data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: integer("verified_by").references(() => users.id),
});

/**
 * Uploads table
 * Stores image uploads as base64 encoded data in the database
 */
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  data: text("data").notNull(), // Base64 encoded image data
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
