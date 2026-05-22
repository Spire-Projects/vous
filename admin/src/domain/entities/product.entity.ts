/**
 * Product entity — dominio puro sin dependencias de framework.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  detail: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  price: number;
  wholesalePrice?: number;
  badge?: string;
  sizes: string[];
  colors: { hex: string; name: string }[];
  materials: string[];
  hasVariants: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isPreorder: boolean;
  isSpecialCollection: boolean;
  isBestseller: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  /** Exclusivo para mayoristas aprobados */
  wholesaleOnly?: boolean;
  /** Stock separado para operaciones mayoristas */
  wholesaleStock?: number;
  stock: number;
  sortOrder: number;
  attributes: Record<string, string>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  detail: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  price: number;
  wholesalePrice?: number;
  badge?: string;
  sizes: string[];
  colors: { hex: string; name: string }[];
  materials: string[];
  hasVariants: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isPreorder: boolean;
  isSpecialCollection: boolean;
  isBestseller: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  wholesaleOnly?: boolean;
  wholesaleStock?: number;
  stock: number;
  sortOrder: number;
  attributes: Record<string, string>;
  tags?: string[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductVariant {
  id: string;
  sku?: string;
  color?: string | null;
  colorHex?: string | null;
  size?: string | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantInput {
  sku?: string;
  color?: string | null;
  colorHex?: string | null;
  size?: string | null;
  stock: number;
  isActive: boolean;
}

export type UpdateVariantInput = Partial<CreateVariantInput>;
