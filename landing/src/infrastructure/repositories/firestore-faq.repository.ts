import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { FAQRepository } from "@/domain/repositories/faq.repository";
import type { FAQ } from "@/domain/entities/faq.entity";

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
  async findActive(): Promise<FAQ[]> {
    try {
      const q = query(
        collection(getFirebaseDb(), "faqs"),
        where("isActive", "==", true),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
    } catch (err) {
      // Fallback: si falla por falta de índice compuesto, traer todos y filtrar/ordenar en memoria
      console.error("[firestoreFAQRepository] Error en query indexada, intentando fallback:", err);
      const qFallback = query(collection(getFirebaseDb(), "faqs"));
      const snap = await getDocs(qFallback);
      return snap.docs
        .map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
        .filter((f) => f.isActive)
        .sort((a, b) => a.order - b.order);
    }
  },
};
