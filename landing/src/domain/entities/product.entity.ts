export interface ProductColor {
  hex: string;
  name: string;
  images?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  /** Precio mayorista en BOB — solo visible a mayoristas aprobados */
  wholesalePrice?: number;
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

export interface ProductVariant {
  id: string;
  sku?: string;
  color?: string | null;
  colorHex?: string | null;
  size?: string | null;
  stock: number;
  isActive: boolean;
}
