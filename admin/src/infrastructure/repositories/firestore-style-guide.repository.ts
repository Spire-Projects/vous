import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";
import type { StyleGuide, CreateStyleGuideInput, UpdateStyleGuideInput } from "@/domain/entities/style-guide.entity";

function mapDoc(id: string, data: Record<string, unknown>): StyleGuide {
  return {
    id,
    type: (data.type as StyleGuide["type"]) ?? "skinTone",
    gender: (data.gender as StyleGuide["gender"]) ?? "unisex",
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
    const q = query(collection(db, "styleGuides"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<StyleGuide | null> {
    const snap = await getDoc(doc(db, "styleGuides", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateStyleGuideInput): Promise<StyleGuide> {
    const docRef = await addDoc(collection(db, "styleGuides"), {
      ...input,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateStyleGuideInput): Promise<void> {
    await updateDoc(doc(db, "styleGuides", id), input);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "styleGuides", id));
  },

  async setActive(id: string, active: boolean): Promise<void> {
    await updateDoc(doc(db, "styleGuides", id), { active });
  },

  async setOrder(id: string, order: number): Promise<void> {
    await updateDoc(doc(db, "styleGuides", id), { order });
  },
};
