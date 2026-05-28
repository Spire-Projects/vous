import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductVariant,
  CreateVariantInput,
  UpdateVariantInput,
} from "@/domain/entities/product.entity";

export interface ProductFlags {
  isFeatured?: boolean;
  isPreorder?: boolean;
  isSpecialCollection?: boolean;
  isBestseller?: boolean;
  isDiscounted?: boolean;
  discountPercentage?: number;
}

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<void>;
  delete(id: string): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
  setFlags(id: string, flags: ProductFlags): Promise<void>;
  applyDiscount(id: string, isDiscounted: boolean, discountPercentage?: number): Promise<void>;
  applyCategoryDiscount(categoryId: string, isDiscounted: boolean, discountPercentage?: number): Promise<void>;
  findVariants(productId: string): Promise<ProductVariant[]>;
  createVariant(productId: string, input: CreateVariantInput): Promise<ProductVariant>;
  updateVariant(productId: string, variantId: string, input: UpdateVariantInput): Promise<void>;
  deleteVariant(productId: string, variantId: string): Promise<void>;
  /** Ajuste manual de stock mayorista */
  updateWholesaleStock(id: string, stock: number): Promise<void>;
  /** Reordena productos en lote */
  updateOrder(items: { id: string; sortOrder: number }[]): Promise<void>;
}
