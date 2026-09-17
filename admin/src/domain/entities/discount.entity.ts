/**
 * Discount entity — dominio puro (códigos de cupón/descuento).
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountInput {
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  maxUses?: number | null;
  isActive: boolean;
  applicableTo: DiscountScope;
  categoryIds?: string[];
  productIds?: string[];
  startDate?: string;
  endDate?: string | null;
}

export type UpdateDiscountInput = Partial<CreateDiscountInput>;
