import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InfluencerRepository } from "@/domain/repositories/influencer.repository";
import type { Influencer, CreateInfluencerInput, UpdateInfluencerInput } from "@/domain/entities/influencer.entity";

const COLLECTION = "influencers";

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

export const firestoreInfluencerRepository: InfluencerRepository = {
  async getAll(): Promise<Influencer[]> {
    const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async create(input: CreateInfluencerInput): Promise<Influencer> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ...input, id: ref.id };
  },

  async update(id: string, input: UpdateInfluencerInput): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      ...input,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
