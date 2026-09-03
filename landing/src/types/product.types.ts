import type { BaseDocument } from "./base.types";

// ── Colección: categories ───────────────────────────────────────────────────

/**
 * Categoría de productos administrable.
 * Ruta: categories/{categoryId}
 */
export interface Category extends BaseDocument {
  name: string;
  /** URL amigable, ej: "ropa-deportiva" */
  slug: string;
  description?: string;
  /** URL de imagen en Cloudinary */
  image?: string;
  /** URL del banner en Cloudinary */
  banner?: string;
  isActive: boolean;
  /** Orden visual en catálogo y landing */
  sortOrder: number;
}

export type CreateCategoryPayload = Omit<Category, "id" | "createdAt" | "updatedAt">;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ── Colección: products ─────────────────────────────────────────────────────

/**
 * Determina qué combinaciones de variantes maneja el producto.
 * - "color_size" → variantes con color Y talla
 * - "color"      → solo color
 * - "size"       → solo talla
 * - "none"       → sin variantes (producto único)
 */
export type VariantType = "color_size" | "color" | "size" | "none";

/**
 * Mapa dinámico de atributos del producto.
 * Los filtros del catálogo se generan automáticamente a partir de estos campos.
 * Se pueden añadir nuevos atributos sin modificar la arquitectura.
 *
 * Atributos iniciales contemplados:
 * - cut       → corte
 * - colors    → colores disponibles
 * - sizes     → tallas disponibles
 * - fabric    → tela
 * - waistband → pretina
 * - length    → largo
 */
export interface ProductAttributes {
  cut?: string;
  colors?: string[];
  sizes?: string[];
  fabric?: string;
  waistband?: string;
  length?: string;
  /** Permite añadir atributos adicionales en el futuro */
  [key: string]: string | string[] | number | boolean | undefined;
}

/**
 * Documento principal de producto.
 * Ruta: products/{productId}
 */
export interface Product extends BaseDocument {
  name: string;
  /** Descripción / detalle del producto */
  detail: string;
  /** Referencia a categories/{categoryId} */
  categoryId?: string;
  /** Snapshot del nombre de categoría para queries rápidas */
  categoryName?: string;
  /** URLs de Cloudinary. El primer elemento es la imagen principal. */
  images?: string[];
  /** Precio minorista en BOB */
  price: number;
  /** Precio mayorista en BOB — solo visible a mayoristas aprobados */
  wholesalePrice?: number;
  /** Atributos dinámicos: tela, corte, tallas, colores, etc. */
  attributes?: ProductAttributes;
  /** Indica si el producto tiene variantes */
  hasVariants: boolean;
  variantType?: VariantType;
  /** Producto marcado como destacado */
  isFeatured: boolean;
  /** Tiene descuento activo */
  isDiscounted: boolean;
  /** Porcentaje de descuento (0–100) */
  discountPercentage?: number;
  /** Precio calculado con el descuento aplicado */
  discountedPrice?: number;
  /** Producto en preventa */
  isPresale: boolean;
  /** Pertenece a una colección especial */
  isSpecialCollection: boolean;
  /** Producto más vendido */
  isBestSeller: boolean;
  /** Exclusivo para mayoristas aprobados */
  isExclusiveWholesale: boolean;
  isActive: boolean;
  /** Orden manual dentro del catálogo */
  sortOrder: number;
  tags?: string[];
  /** Total de unidades vendidas (para reportes y ranking) */
  totalSold: number;
}

// ── Subcolección: products/{productId}/variants ─────────────────────────────

/**
 * Variante individual de un producto con stock propio.
 * Ruta: products/{productId}/variants/{variantId}
 *
 * Ejemplos:
 *  - color_size → { color: "Negro", size: "M", stock: 10 }
 *  - size       → { color: null,    size: "L", stock: 5  }
 *  - color      → { color: "Blanco",size: null,stock: 8  }
 *  - none       → { color: null,    size: null,stock: 20 }
 */
export interface ProductVariant extends BaseDocument {
  /** SKU individual — opcional */
  sku?: string;
  color?: string | null;
  size?: string | null;
  /** Stock disponible para esta combinación específica */
  stock: number;
  isActive: boolean;
}

export type CreateProductPayload = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductPayload = Partial<CreateProductPayload>;

export type CreateVariantPayload = Omit<ProductVariant, "id" | "createdAt" | "updatedAt">;
export type UpdateVariantPayload = Partial<CreateVariantPayload>;

// ── Tipos de utilidad para el catálogo ─────────────────────────────────────

/** Producto con sus variantes precargadas (para páginas de detalle) */
export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

/**
 * Filtros dinámicos generados a partir de los atributos de los productos activos.
 * Cada key es el nombre del atributo y el value es el conjunto de valores únicos.
 */
export type CatalogFilters = Record<string, string[]>;
