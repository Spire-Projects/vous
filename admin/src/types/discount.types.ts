import type { BaseDocument, AnyTimestamp } from "./base.types";

export type DiscountType = "percentage" | "fixed";
export type DiscountScope = "all" | "categories" | "products";

/**
 * Código de descuento. Ruta: discounts/{discountId}
 */
export interface Discount extends BaseDocument {
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  maxUses?: number | null;
  usedCount: number;
  isActive: boolean;
  applicableTo: DiscountScope;
  categoryIds?: string[];
  productIds?: string[];
  startDate?: AnyTimestamp;
  endDate?: AnyTimestamp | null;
}

export type CreateDiscountPayload = Omit<
  Discount,
  "id" | "createdAt" | "updatedAt" | "usedCount"
>;
export type UpdateDiscountPayload = Partial<CreateDiscountPayload>;
