export type UserRole = "admin" | "superadmin";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
}

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export type StockStatus = "ACTIVO" | "INACTIVO" | "AGOTADO";

export interface ProductVariant {
  size: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  variants: ProductVariant[];
  stock: number;
  status: StockStatus;
  isCritical?: boolean;
}

export type WholesaleStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO";

export interface WholesaleRequest {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  location: string;
  date: string;
  status: WholesaleStatus;
}

export interface MetricCard {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
