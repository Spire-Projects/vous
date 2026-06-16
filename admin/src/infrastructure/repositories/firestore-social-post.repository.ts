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
import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";
import type { SocialPost, CreateSocialPostInput, UpdateSocialPostInput } from "@/domain/entities/social-post.entity";

function mapDoc(id: string, data: Record<string, unknown>): SocialPost {
  return {
    id,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    videoUrl: (data.videoUrl as string) ?? "",
    platform: (data.platform as SocialPost["platform"]) ?? "instagram",
    thumbnailUrl: (data.thumbnailUrl as string) ?? "",
    active: (data.active as boolean) ?? true,
    order: (data.order as number) ?? 0,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreSocialPostRepository: SocialPostRepository = {
  async findAll(): Promise<SocialPost[]> {
    const q = query(collection(db, "socialPosts"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<SocialPost | null> {
    const snap = await getDoc(doc(db, "socialPosts", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateSocialPostInput): Promise<SocialPost> {
    const docRef = await addDoc(collection(db, "socialPosts"), {
      ...input,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateSocialPostInput): Promise<void> {
    await updateDoc(doc(db, "socialPosts", id), input);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "socialPosts", id));
  },

  async setActive(id: string, active: boolean): Promise<void> {
    await updateDoc(doc(db, "socialPosts", id), { active });
  },

  async setOrder(id: string, order: number): Promise<void> {
    await updateDoc(doc(db, "socialPosts", id), { order });
  },
};
