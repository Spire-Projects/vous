import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export const firestoreProductRepository: ProductRepository = {
  async findAll(): Promise<Product[]> {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  },

  async findBySlug(slug: string): Promise<Product | null> {
    const q = query(collection(db, "products"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Product;
  },

  async findById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  },

  async findByCategory(categoryId: string): Promise<Product[]> {
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  },
};
