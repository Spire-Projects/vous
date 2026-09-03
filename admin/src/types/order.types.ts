import type { BaseDocument, AnyTimestamp } from "./base.types";
import type { CustomerSnapshot } from "./user.types";

// ── Estados del pedido ──────────────────────────────────────────────────────

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

// ── Items ───────────────────────────────────────────────────────────────────

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

// ── Datos adicionales ───────────────────────────────────────────────────────

export interface BillingInfo {
  nit: string;
  businessName: string;
  email?: string;
}

export type ShippingType = "local" | "national";

export interface ShippingInfo {
  fullName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  shippingType: ShippingType;
  carrier?: string;
  trackingInfo?: string;
}

// ── Colección: orders ───────────────────────────────────────────────────────

/**
 * Pedido completo. Ruta: orders/{orderId}
 */
export interface Order extends BaseDocument {
  orderNumber: string;
  customerId: string;
  customerSnapshot: CustomerSnapshot;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  billingInfo?: BillingInfo;
  shippingInfo: ShippingInfo;
  isWholesale: boolean;
  discountCode?: string;
  adminNotes?: string;
}

// ── Subcolección: orders/{orderId}/statusHistory ────────────────────────────

export type StatusHistoryActor = "admin" | "system";

export interface OrderStatusEntry {
  id: string;
  status: OrderStatus;
  changedBy: string;
  role: StatusHistoryActor;
  note?: string;
  timestamp: AnyTimestamp;
}

export type CreateOrderPayload = Omit<Order, "id" | "createdAt" | "updatedAt">;
export type UpdateOrderPayload = Partial<
  Pick<Order, "status" | "paymentProof" | "adminNotes" | "shippingInfo">
>;
