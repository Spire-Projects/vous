import type { BaseDocument } from "./base.types";

// ── Colección: categories ───────────────────────────────────────────────────

export interface Category extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  isActive: boolean;
  sortOrder: number;
}

export type CreateCategoryPayload = Omit<
  Category,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ── Colección: products ─────────────────────────────────────────────────────

export type VariantType = "color_size" | "color" | "size" | "none";

export interface ProductAttributes {
  cut?: string;
  colors?: string[];
  sizes?: string[];
  fabric?: string;
  waistband?: string;
  length?: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

/**
 * Documento principal de producto.
 * Ruta: products/{productId}
 */
export interface Product extends BaseDocument {
  name: string;
  detail: string;
  categoryId?: string;
  categoryName?: string;
  images?: string[];
  price: number;
  wholesalePrice?: number;
  attributes?: ProductAttributes;
  hasVariants: boolean;
  variantType?: VariantType;
  isFeatured: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  discountedPrice?: number;
  isPresale: boolean;
  isSpecialCollection: boolean;
  isBestSeller: boolean;
  isExclusiveWholesale: boolean;
  isActive: boolean;
  sortOrder: number;
  tags?: string[];
  totalSold: number;
}

// ── Subcolección: products/{productId}/variants ─────────────────────────────

/**
 * Variante individual con stock propio.
 * Ruta: products/{productId}/variants/{variantId}
 */
export interface ProductVariant extends BaseDocument {
  sku?: string;
  color?: string | null;
  size?: string | null;
  stock: number;
  isActive: boolean;
}

export type CreateProductPayload = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProductPayload = Partial<CreateProductPayload>;

export type CreateVariantPayload = Omit<
  ProductVariant,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateVariantPayload = Partial<CreateVariantPayload>;

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

export type CatalogFilters = Record<string, string[]>;
