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
import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";
import type { Feedback, CreateFeedbackInput, UpdateFeedbackInput } from "@/domain/entities/feedback.entity";

function mapDoc(id: string, data: Record<string, unknown>): Feedback {
  return {
    id,
    userId: (data.userId as string) ?? "",
    userName: (data.userName as string) ?? "",
    userEmail: (data.userEmail as string) ?? "",
    type: (data.type as Feedback["type"]) ?? "recomendacion",
    message: (data.message as string) ?? "",
    status: (data.status as Feedback["status"]) ?? "pending",
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreFeedbackRepository: FeedbackRepository = {
  async findAll(): Promise<Feedback[]> {
    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<Feedback | null> {
    const snap = await getDoc(doc(db, "feedback", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateFeedbackInput): Promise<Feedback> {
    const docRef = await addDoc(collection(db, "feedback"), {
      ...input,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateFeedbackInput): Promise<void> {
    await updateDoc(doc(db, "feedback", id), input);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "feedback", id));
  },

  async setStatus(id: string, status: Feedback["status"]): Promise<void> {
    await updateDoc(doc(db, "feedback", id), { status });
  },
};
