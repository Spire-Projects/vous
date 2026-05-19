export interface ProductColor {
  hex: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  categoryId: string;
  categoryName: string;
  badge?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
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

export interface ProductVariant {
  id: string;
  sku?: string;
  color?: string | null;
  colorHex?: string | null;
  size?: string | null;
  stock: number;
  isActive: boolean;
}
