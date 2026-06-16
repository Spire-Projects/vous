import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";
import type { Feedback, CreateFeedbackInput } from "@/domain/entities/feedback.entity";

export const firestoreFeedbackRepository: FeedbackRepository = {
  async create(input: CreateFeedbackInput): Promise<Feedback> {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, "feedback"), {
      ...input,
      createdAt: serverTimestamp(),
    });
    // Return the created feedback without reading back (avoids extra read)
    return {
      id: docRef.id,
      ...input,
      createdAt: new Date().toISOString(),
    };
  },
};
