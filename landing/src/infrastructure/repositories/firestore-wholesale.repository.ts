import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { WholesaleRepository } from "@/domain/repositories/wholesale.repository";

export const firestoreWholesaleRepository: WholesaleRepository = {
  async submit(request): Promise<void> {
    await addDoc(collection(db, "wholesaleRequests"), {
      ...request,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  },
};
