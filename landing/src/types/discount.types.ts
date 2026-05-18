import type { BaseDocument } from "./base.types";

// ── Colección: discounts ────────────────────────────────────────────────────

export type DiscountType = "percentage" | "fixed";
export type DiscountScope = "all" | "categories" | "products";

/**
 * Código de descuento / cupón promocional.
 * Ruta: discounts/{discountId}
 */
export interface Discount extends BaseDocument {
  /** Código único, ej: "VOUS10" */
  code: string;
  description?: string;
  type: DiscountType;
  /** Valor del descuento: porcentaje (0–100) o monto fijo en BOB */
  value: number;
  /** Compra mínima requerida en BOB */
  minPurchase?: number;
  /** Máximo de usos — null = ilimitado */
  maxUses?: number | null;
  /** Contador de usos actuales */
  usedCount: number;
  isActive: boolean;
  applicableTo: DiscountScope;
  /** IDs de categorías donde aplica (cuando applicableTo = "categories") */
  categoryIds?: string[];
  /** IDs de productos donde aplica (cuando applicableTo = "products") */
  productIds?: string[];
  startDate?: import("./base.types").AnyTimestamp;
  /** null = sin vencimiento */
  endDate?: import("./base.types").AnyTimestamp | null;
}

export type CreateDiscountPayload = Omit<
  Discount,
  "id" | "createdAt" | "updatedAt" | "usedCount"
>;
export type UpdateDiscountPayload = Partial<CreateDiscountPayload>;
