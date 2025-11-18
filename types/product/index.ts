/**
 * Product types for catalog items with pricing and stock information
 */

export interface Product {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
