/**
 * Order types for customer purchases with payment verification status
 */

import type { Product } from "../product";
import type { OCRData } from "../ocr";

export interface Order {
  id: number;
  productId: number;
  product?: Product;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  quantity: number;
  totalAmount: number;
  paymentSlipUrl?: string;
  status: "pending" | "verified" | "rejected";
  ocrData?: OCRData;
  createdAt: Date;
  verifiedAt?: Date;
  verifiedBy?: number;
}
