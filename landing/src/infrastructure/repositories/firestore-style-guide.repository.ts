import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";
import type { StyleGuide, StyleGuideType, StyleGuideGender } from "@/domain/entities/style-guide.entity";

function mapDoc(id: string, data: Record<string, unknown>): StyleGuide {
  return {
    id,
    type: (data.type as StyleGuideType) ?? "skinTone",
    gender: (data.gender as StyleGuideGender) ?? "unisex",
    name: (data.name as string) ?? "",
    description: (data.description as string) ?? "",
    imageUrl: (data.imageUrl as string) ?? "",
    galleryImages: (data.galleryImages as string[]) ?? [],
    colorHex: (data.colorHex as string) ?? undefined,
    recommendedColors: (data.recommendedColors as string[]) ?? [],
    recommendedAttributes: (data.recommendedAttributes as string[]) ?? [],
    order: (data.order as number) ?? 0,
    active: (data.active as boolean) ?? true,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreStyleGuideRepository: StyleGuideRepository = {
  async findAll(): Promise<StyleGuide[]> {
    const db = getFirebaseDb();
    const q = query(collection(db, "styleGuides"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
      .filter((g) => g.active);
  },
};
