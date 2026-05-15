import {
  collection, getDocs, doc, updateDoc, query, where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WholesaleRepository } from "@/domain/repositories/wholesale.repository";
import type { WholesaleRequest, ReviewWholesaleInput } from "@/domain/entities/wholesale.entity";

export const firestoreWholesaleRepository: WholesaleRepository = {
  async findAll(): Promise<WholesaleRequest[]> {
    const q = query(collection(db, "wholesaleRequests"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WholesaleRequest);
  },

  async findByStatus(status: WholesaleRequest["status"]): Promise<WholesaleRequest[]> {
    const q = query(collection(db, "wholesaleRequests"), where("status", "==", status));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WholesaleRequest);
  },

  async review({ requestId, status, reviewNote, reviewedBy }: ReviewWholesaleInput): Promise<void> {
    await updateDoc(doc(db, "wholesaleRequests", requestId), {
      status,
      reviewNote: reviewNote ?? "",
      reviewedBy,
      reviewedAt: serverTimestamp(),
    });
  },
};
