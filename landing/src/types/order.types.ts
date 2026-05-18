import type { BaseDocument, AnyTimestamp } from "./base.types";
import type { CustomerSnapshot } from "./user.types";

// ── Estados del pedido ──────────────────────────────────────────────────────

/**
 * Estados operativos de un pedido. Todos son visibles al cliente.
 *
 * Flujo típico:
 * pending → payment_sent → verifying_payment → confirmed → preparing → shipped → delivered
 * (cualquier estado puede ir a cancelled)
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

/** Métodos de pago disponibles */
export type PaymentMethod = "qr" | "libelula";

// ── Items del pedido ────────────────────────────────────────────────────────

/**
 * Snapshot inmutable de un producto al momento de realizar el pedido.
 * Se almacena directamente en el array `items` del pedido.
 */
export interface OrderItem {
  productId: string;
  /** null si el producto no tiene variantes */
  variantId?: string | null;
  productName: string;
  /** Descripción legible de la variante, ej: "Negro / M" */
  variantDescription?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  /** true si se aplicó precio mayorista */
  isWholesalePrice: boolean;
}

// ── Información de facturación ──────────────────────────────────────────────

/** Datos de facturación (NIT / Libélula) — opcional */
export interface BillingInfo {
  nit: string;
  businessName: string;
  email?: string;
}

// ── Información de envío ────────────────────────────────────────────────────

export type ShippingType = "local" | "national";

export interface ShippingInfo {
  fullName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  shippingType: ShippingType;
  /** Transportista externo, ej: "Yango" */
  carrier?: string;
  trackingInfo?: string;
}

// ── Colección: orders ───────────────────────────────────────────────────────

/**
 * Pedido completo.
 * Ruta: orders/{orderId}
 */
export interface Order extends BaseDocument {
  /** Número legible, ej: "VOUS-2026-0042" */
  orderNumber: string;
  /** Referencia a users/{userId} */
  customerId: string;
  /** Snapshot del cliente al momento del pedido */
  customerSnapshot: CustomerSnapshot;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  /** URL del comprobante de pago en Cloudinary (pagos por QR) */
  paymentProof?: string;
  billingInfo?: BillingInfo;
  shippingInfo: ShippingInfo;
  isWholesale: boolean;
  discountCode?: string;
  /** Notas internas del administrador */
  adminNotes?: string;
}

// ── Subcolección: orders/{orderId}/statusHistory ────────────────────────────

export type StatusHistoryActor = "admin" | "system";

/**
 * Entrada del historial de estados de un pedido.
 * Ruta: orders/{orderId}/statusHistory/{entryId}
 */
export interface OrderStatusEntry {
  id: string;
  status: OrderStatus;
  /** UID del actor que realizó el cambio */
  changedBy: string;
  role: StatusHistoryActor;
  note?: string;
  timestamp: AnyTimestamp;
}

export type CreateOrderPayload = Omit<Order, "id" | "createdAt" | "updatedAt">;
export type UpdateOrderPayload = Partial<
  Pick<Order, "status" | "paymentProof" | "adminNotes" | "shippingInfo">
>;
