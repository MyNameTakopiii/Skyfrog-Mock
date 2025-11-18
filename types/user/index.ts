/**
 * User types for authenticated sellers/admins with role-based access
 */

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "seller" | "admin";
  createdAt: Date;
}
