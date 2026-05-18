import { getFirebaseDb } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where, limit } from "firebase/firestore";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

function mapDoc(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    slug: (data.slug as string) ?? "",
    name: (data.name as string) ?? "",
    description: (data.description as string) ?? "",
    detail: (data.detail as string) ?? "",
    price: (data.price as number) ?? 0,
    categoryId: (data.categoryId as string) ?? "",
    categoryName: (data.categoryName as string) ?? "",
    badge: (data.badge as string) ?? undefined,
    images: (data.images as string[]) ?? [],
    sizes: (data.sizes as string[]) ?? [],
    colors: (data.colors as { hex: string; name: string }[]) ?? [],
    materials: (data.materials as string[]) ?? [],
    hasVariants: (data.hasVariants as boolean) ?? false,
    isActive: (data.isActive as boolean) ?? true,
    isFeatured: (data.isFeatured as boolean) ?? false,
    isDiscounted: (data.isDiscounted as boolean) ?? false,
    discountPercentage: (data.discountPercentage as number) ?? undefined,
    stock: (data.stock as number) ?? 0,
    sortOrder: (data.sortOrder as number) ?? 0,
    tags: (data.tags as string[]) ?? undefined,
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
    const snap = await getDocs(collection(getFirebaseDb(), "products"));
    return snap.docs
      .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.isActive);
  },

  async findBySlug(slug: string): Promise<Product | null> {
    const q = query(collection(getFirebaseDb(), "products"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return mapDoc(d.id, d.data() as Record<string, unknown>);
  },

  async findById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(getFirebaseDb(), "products", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async findByCategory(categoryId: string): Promise<Product[]> {
    const q = query(
      collection(getFirebaseDb(), "products"),
      where("categoryId", "==", categoryId),
      where("isActive", "==", true)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },
};
