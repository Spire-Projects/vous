import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product, CreateProductInput, UpdateProductInput } from "@/domain/entities/product.entity";

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
};
