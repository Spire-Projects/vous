import { getFirebaseDb } from "@/lib/firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import type { DiscountRepository } from "@/domain/repositories/discount.repository";
import type { Discount } from "@/domain/entities/discount.entity";

function mapDoc(id: string, data: Record<string, unknown>): Discount {
  return {
    id,
    code: (data.code as string) ?? "",
    description: (data.description as string) ?? undefined,
    type: (data.type as Discount["type"]) ?? "percentage",
    value: (data.value as number) ?? 0,
    minPurchase: (data.minPurchase as number) ?? undefined,
    maxUses: (data.maxUses as number | null) ?? null,
    usedCount: (data.usedCount as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    applicableTo: (data.applicableTo as Discount["applicableTo"]) ?? "all",
    categoryIds: (data.categoryIds as string[]) ?? undefined,
    productIds: (data.productIds as string[]) ?? undefined,
    startDate: (data.startDate as { toDate?: () => Date })?.toDate?.().toISOString() ?? undefined,
    endDate: (data.endDate as { toDate?: () => Date })?.toDate?.().toISOString() ?? null,
  };
}

export const firestoreDiscountRepository: DiscountRepository = {
  async findByCode(code: string): Promise<Discount | null> {
    const q = query(
      collection(getFirebaseDb(), "discounts"),
      where("code", "==", code.toUpperCase()),
      where("isActive", "==", true),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return mapDoc(d.id, d.data() as Record<string, unknown>);
  },
};
