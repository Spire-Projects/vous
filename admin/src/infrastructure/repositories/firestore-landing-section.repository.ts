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
import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";
import type {
  LandingSection,
  LandingSectionType,
  CreateLandingSectionInput,
  UpdateLandingSectionInput,
} from "@/domain/entities/landing-section.entity";

function mapDoc(id: string, data: Record<string, unknown>): LandingSection {
  return {
    id,
    name: (data.name as string) ?? "",
    type: (data.type as LandingSectionType) ?? "featured",
    active: (data.active as boolean) ?? false,
    order: (data.order as number) ?? 0,
    productIds: (data.productIds as string[]) ?? [],
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreLandingSectionRepository: LandingSectionRepository = {
  async findAll(): Promise<LandingSection[]> {
    const q = query(collection(db, "landingSections"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<LandingSection | null> {
    const snap = await getDoc(doc(db, "landingSections", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateLandingSectionInput): Promise<LandingSection> {
    const docRef = await addDoc(collection(db, "landingSections"), {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateLandingSectionInput): Promise<void> {
    await updateDoc(doc(db, "landingSections", id), {
      ...input,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "landingSections", id));
  },

  async setActive(id: string, active: boolean): Promise<void> {
    await updateDoc(doc(db, "landingSections", id), { active, updatedAt: serverTimestamp() });
  },

  async updateOrder(id: string, order: number): Promise<void> {
    await updateDoc(doc(db, "landingSections", id), { order, updatedAt: serverTimestamp() });
  },

  async setProducts(id: string, productIds: string[]): Promise<void> {
    await updateDoc(doc(db, "landingSections", id), {
      productIds,
      updatedAt: serverTimestamp(),
    });
  },
};
