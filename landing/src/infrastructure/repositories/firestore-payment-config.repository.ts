import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { PaymentConfigRepository } from "@/domain/repositories/payment-config.repository";
import type { PaymentConfig } from "@/domain/entities/payment-config.entity";

const COLLECTION = "settings";
const DOC_ID = "payment";

export const firestorePaymentConfigRepository: PaymentConfigRepository = {
  async get(): Promise<PaymentConfig | null> {
    const snap = await getDoc(doc(getFirebaseDb(), COLLECTION, DOC_ID));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      qrImageUrl: (data["qrImageUrl"] as string) ?? "",
      updatedAt:
        (data["updatedAt"] as { toDate?: () => Date })?.toDate?.().toISOString() ??
        new Date().toISOString(),
    };
  },
};
