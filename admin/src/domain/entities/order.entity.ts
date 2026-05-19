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

export interface ShippingInfo {
  fullName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  shippingType: "local" | "national";
  carrier?: string;
  trackingInfo?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isWholesalePrice: boolean;
  variantId?: string;
  variantDescription?: string;
  imageUrl?: string;
}

export interface OrderCustomer {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
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
  paymentProof?: string;
  shippingInfo?: ShippingInfo;
  isWholesale: boolean;
  discountCode?: string;
  carrierRef?: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
  adminNotes?: string;
}
