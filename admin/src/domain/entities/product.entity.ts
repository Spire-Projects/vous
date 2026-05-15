/**
 * Product entity — dominio puro sin dependencias de framework.
 * Fuente de verdad para la capa de aplicación e infraestructura.
 */
export interface Product {
  id: string;
  name: string;
  detail: string;
  categoryId?: string;
  categoryName?: string;
  images?: string[];
  price: number;
  wholesalePrice?: number;
  hasVariants: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isDiscounted: boolean;
  discountPercentage?: number;
  stock?: number;
  sortOrder: number;
  tags?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color?: string;
  size?: string;
  stock: number;
  isActive: boolean;
}
