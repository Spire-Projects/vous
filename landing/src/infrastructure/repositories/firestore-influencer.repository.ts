import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Influencer } from "@/domain/entities/influencer.entity";

function mapDoc(id: string, data: Record<string, unknown>): Influencer {
  return {
    id,
    name: (data.name as string) ?? "",
    imageUrl: (data.imageUrl as string) ?? "",
    images: (data.images as string[]) ?? [],
    instagramUrl: (data.instagramUrl as string) ?? "",
    tiktokUrl: (data.tiktokUrl as string) ?? "",
    order: (data.order as number) ?? 0,
  };
}

export async function getInfluencers(): Promise<Influencer[]> {
  const db = getFirebaseDb();
  const q = query(collection(db, "influencers"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
}
