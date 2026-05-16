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
  isDiscounted: boolean;
  discountPercentage?: number;
  stock: number;
  sortOrder: number;
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
  isDiscounted: boolean;
  discountPercentage?: number;
  stock: number;
  sortOrder: number;
  tags?: string[];
}

export type UpdateProductInput = Partial<CreateProductInput>;
