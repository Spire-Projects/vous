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
  variantId?: string | null;
  productName: string;
  variantDescription?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isWholesalePrice: boolean;
}

export interface OrderCustomerSnapshot {
  name: string;
  email: string;
  phone?: string;
  department?: string;
}

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

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerSnapshot: OrderCustomerSnapshot;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  shippingInfo?: ShippingInfo;
  isWholesale: boolean;
  adminNotes?: string;
  carrierRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerId: string;
  customerSnapshot: OrderCustomerSnapshot;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  shippingInfo: ShippingInfo;
  isWholesale: boolean;
}

