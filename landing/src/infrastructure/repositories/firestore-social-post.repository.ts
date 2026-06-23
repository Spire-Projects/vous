import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";
import type { SocialPost } from "@/domain/entities/social-post.entity";

function mapDoc(id: string, data: Record<string, unknown>): SocialPost {
  return {
    id,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    videoUrl: (data.videoUrl as string) ?? "",
    platform: (data.platform as SocialPost["platform"]) ?? "instagram",
    thumbnailUrl: (data.thumbnailUrl as string) ?? "",
    images: (data.images as string[]) ?? [],
    active: (data.active as boolean) ?? true,
    order: (data.order as number) ?? 0,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreSocialPostRepository: SocialPostRepository = {
  async findAllActive(): Promise<SocialPost[]> {
    const db = getFirebaseDb();
    const q = query(
      collection(db, "socialPosts"),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
      .filter((p) => p.active);
  },
};
