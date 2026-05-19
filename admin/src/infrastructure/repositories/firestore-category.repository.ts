import {
  collection, getDocs, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, writeBatch, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CategoryRepository } from "@/domain/repositories/category.repository";
import type { Category, CreateCategoryInput } from "@/domain/entities/category.entity";

function mapDoc(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? "",
    description: (data.description as string) ?? undefined,
    image: (data.image as string) ?? undefined,
    banner: (data.banner as string) ?? undefined,
    isActive: (data.isActive as boolean) ?? true,
    sortOrder: (data.sortOrder as number) ?? 0,
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ?? new Date().toISOString(),
    updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ?? new Date().toISOString(),
  };
}

export const firestoreCategoryRepository: CategoryRepository = {
  async findAll(): Promise<Category[]> {
    const q = query(collection(db, "categories"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async save(data: CreateCategoryInput): Promise<Category> {
    const ref = await addDoc(collection(db, "categories"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, data: Partial<CreateCategoryInput>): Promise<void> {
    await updateDoc(doc(db, "categories", id), { ...data, updatedAt: serverTimestamp() });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, "categories", id));
  },

  async updateOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const batch = writeBatch(db);
    for (const { id, sortOrder } of items) {
      batch.update(doc(db, "categories", id), { sortOrder });
    }
    await batch.commit();
  },
};
