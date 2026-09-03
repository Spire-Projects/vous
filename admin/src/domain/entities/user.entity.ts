/**
 * User entities — dominio puro.
 */
export type CustomerRole = "customer" | "wholesaler";
export type AdminRole = "admin" | "superadmin";

export interface Customer {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: CustomerRole;
  isActive: boolean;
  createdAt?: unknown;
}

export interface AdminUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: unknown;
}
