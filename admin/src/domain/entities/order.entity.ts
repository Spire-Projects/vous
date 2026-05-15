/**
 * Order entity — dominio puro.
 */
export type OrderStatus =
  | "pending"
  | "payment_sent"
  | "verifying_payment"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "qr" | "libelula";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isWholesalePrice: boolean;
  variantId?: string;
  imageUrl?: string;
}

export interface OrderCustomer {
  uid: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isWholesale: boolean;
  adminNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
  adminNotes?: string;
}
