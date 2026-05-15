import { collection, getDocs, doc, getDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export const firestoreProductRepository: ProductRepository = {
  async findAll(): Promise<Product[]> {
    const q = query(collection(db, "products"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  },

  async findById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  },

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const { query: q2, where } = await import("firebase/firestore");
    const q = q2(collection(db, "products"), where("categoryId", "==", categoryId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  },

  async update(id: string, data: Partial<Product>): Promise<void> {
    await updateDoc(doc(db, "products", id), data as Record<string, unknown>);
  },

  async setActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, "products", id), { isActive });
  },
};
