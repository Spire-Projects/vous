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
import type { BannerRepository } from "@/domain/repositories/banner.repository";
import type { Banner, CreateBannerInput, UpdateBannerInput } from "@/domain/entities/banner.entity";

function mapDoc(id: string, data: Record<string, unknown>): Banner {
  return {
    id,
    imageUrl: (data.imageUrl as string) ?? "",
    title: (data.title as string) ?? "",
    subtitle: (data.subtitle as string) ?? "",
    ctaText: (data.ctaText as string) ?? "",
    ctaUrl: (data.ctaUrl as string) ?? "",
    active: (data.active as boolean) ?? true,
    order: (data.order as number) ?? 0,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreBannerRepository: BannerRepository = {
  async findAll(): Promise<Banner[]> {
    const q = query(collection(db, "banners"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<Banner | null> {
    const snap = await getDoc(doc(db, "banners", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateBannerInput): Promise<Banner> {
    const docRef = await addDoc(collection(db, "banners"), {
      ...input,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateBannerInput): Promise<void> {
    await updateDoc(doc(db, "banners", id), input);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "banners", id));
  },

  async setActive(id: string, active: boolean): Promise<void> {
    await updateDoc(doc(db, "banners", id), { active });
  },

  async updateOrder(id: string, order: number): Promise<void> {
    await updateDoc(doc(db, "banners", id), { order });
  },
};
