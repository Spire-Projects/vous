import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { CategoryRepository } from "@/domain/repositories/category.repository";
import type { Category } from "@/domain/entities/category.entity";

function mapDoc(id: string, data: Record<string, unknown>): Category {
  const tsToIso = (field: unknown): string => {
    const t = field as { toDate?: () => Date } | null;
    return t?.toDate?.().toISOString() ?? new Date().toISOString();
  };

  return {
    id,
    name: (data.name as string) ?? "",
    slug: (data.slug as string) ?? "",
    description: data.description as string | undefined,
    image: data.image as string | undefined,
    banner: data.banner as string | undefined,
    images: (data.images as string[]) ?? [],
    isActive: (data.isActive as boolean) ?? true,
    sortOrder: (data.sortOrder as number) ?? 0,
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
  };
}

export const firestoreCategoryRepository: CategoryRepository = {
  async findAll(): Promise<Category[]> {
    try {
      const q = query(
        collection(getFirebaseDb(), "categories"),
        where("isActive", "==", true),
        orderBy("sortOrder", "asc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
    } catch {
      const q = query(collection(getFirebaseDb(), "categories"), orderBy("sortOrder", "asc"));
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
        .filter((c) => c.isActive);
    }
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const q = query(collection(getFirebaseDb(), "categories"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return mapDoc(doc.id, doc.data() as Record<string, unknown>);
  },
};
