import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductVariant,
  CreateVariantInput,
  UpdateVariantInput,
} from "@/domain/entities/product.entity";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
  findVariants(productId: string): Promise<ProductVariant[]>;
  createVariant(productId: string, input: CreateVariantInput): Promise<ProductVariant>;
  updateVariant(productId: string, variantId: string, input: UpdateVariantInput): Promise<void>;
  deleteVariant(productId: string, variantId: string): Promise<void>;
}
