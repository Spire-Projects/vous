import {
  collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type {
  Product, CreateProductInput, UpdateProductInput,
  ProductVariant, CreateVariantInput, UpdateVariantInput,
} from "@/domain/entities/product.entity";

function mapDoc(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? "",
    description: (data.description as string) ?? "",
    detail: (data.detail as string) ?? "",
    categoryId: (data.categoryId as string) ?? "",
    categoryName: (data.categoryName as string) ?? "",
    images: (data.images as string[]) ?? [],
    price: (data.price as number) ?? 0,
    wholesalePrice: (data.wholesalePrice as number) ?? undefined,
    badge: (data.badge as string) ?? undefined,
    sizes: (data.sizes as string[]) ?? [],
    colors: (data.colors as { hex: string; name: string }[]) ?? [],
    materials: (data.materials as string[]) ?? [],
    hasVariants: (data.hasVariants as boolean) ?? false,
    isActive: (data.isActive as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    isPreorder: (data.isPreorder as boolean) ?? false,
    isSpecialCollection: (data.isSpecialCollection as boolean) ?? false,
    isBestseller: (data.isBestseller as boolean) ?? false,
    isDiscounted: (data.isDiscounted as boolean) ?? false,
    discountPercentage: (data.discountPercentage as number) ?? undefined,
    stock: (data.stock as number) ?? 0,
    sortOrder: (data.sortOrder as number) ?? 0,
    attributes: (data.attributes as Record<string, string>) ?? {},
    tags: (data.tags as string[]) ?? undefined,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

function mapVariant(id: string, data: Record<string, unknown>): ProductVariant {
  return {
    id,
    sku: (data.sku as string) ?? undefined,
    color: (data.color as string | null) ?? null,
    colorHex: (data.colorHex as string | null) ?? null,
    size: (data.size as string | null) ?? null,
    stock: (data.stock as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreProductRepository: ProductRepository = {
  async findAll(): Promise<Product[]> {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async create(input: CreateProductInput): Promise<Product> {
    const payload = Object.fromEntries(
      Object.entries({ ...input }).filter(([, v]) => v !== undefined)
    );
    const docRef = await addDoc(collection(db, "products"), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateProductInput): Promise<void> {
    const payload = Object.fromEntries(
      Object.entries({ ...input }).filter(([, v]) => v !== undefined)
    );
    await updateDoc(doc(db, "products", id), { ...payload, updatedAt: serverTimestamp() });
  },

  async setActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, "products", id), { isActive, updatedAt: serverTimestamp() });
  },

  async findVariants(productId: string): Promise<ProductVariant[]> {
    const q = query(collection(db, "products", productId, "variants"), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapVariant(d.id, d.data() as Record<string, unknown>));
  },

  async createVariant(productId: string, input: CreateVariantInput): Promise<ProductVariant> {
    const payload = Object.fromEntries(Object.entries({ ...input }).filter(([, v]) => v !== undefined));
    const docRef = await addDoc(collection(db, "products", productId, "variants"), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapVariant(snap.id, snap.data() as Record<string, unknown>);
  },

  async updateVariant(productId: string, variantId: string, input: UpdateVariantInput): Promise<void> {
    const payload = Object.fromEntries(Object.entries({ ...input }).filter(([, v]) => v !== undefined));
    await updateDoc(doc(db, "products", productId, "variants", variantId), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteVariant(productId: string, variantId: string): Promise<void> {
    await deleteDoc(doc(db, "products", productId, "variants", variantId));
  },
};
