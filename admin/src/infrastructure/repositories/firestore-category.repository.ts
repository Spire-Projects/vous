import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CategoryRepository } from "@/domain/repositories/category.repository";
import type { Category } from "@/domain/entities/category.entity";

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
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreCategoryRepository: CategoryRepository = {
  async findAll(): Promise<Category[]> {
    const q = query(collection(db, "categories"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },
};
