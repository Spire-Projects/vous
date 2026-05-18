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
import type { FAQRepository } from "@/domain/repositories/faq.repository";
import type { FAQ, CreateFAQInput, UpdateFAQInput } from "@/domain/entities/faq.entity";

function mapDoc(id: string, data: Record<string, unknown>): FAQ {
  return {
    id,
    question: (data.question as string) ?? "",
    answer: (data.answer as string) ?? "",
    order: (data.order as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreFAQRepository: FAQRepository = {
  async findAll(): Promise<FAQ[]> {
    const q = query(collection(db, "faqs"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<FAQ | null> {
    const snap = await getDoc(doc(db, "faqs", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateFAQInput): Promise<FAQ> {
    const docRef = await addDoc(collection(db, "faqs"), {
      ...input,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateFAQInput): Promise<void> {
    await updateDoc(doc(db, "faqs", id), input);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "faqs", id));
  },

  async setActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, "faqs", id), { isActive });
  },
};
