/**
 * Discount entity — dominio puro (códigos de cupón/descuento).
 * Solo lectura desde el landing.
 */
export type DiscountType = "percentage" | "fixed";
export type DiscountScope = "all" | "categories" | "products";

export interface Discount {
  id: string;
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
  startDate?: string;
  endDate?: string | null;
}
