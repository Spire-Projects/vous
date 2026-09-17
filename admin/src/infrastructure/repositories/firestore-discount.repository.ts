import {
  collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, limit, serverTimestamp, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DiscountRepository } from "@/domain/repositories/discount.repository";
import type {
  Discount, CreateDiscountInput, UpdateDiscountInput,
} from "@/domain/entities/discount.entity";

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
    startDate:
      (data.startDate as { toDate?: () => Date })?.toDate?.().toISOString() ?? undefined,
    endDate:
      (data.endDate as { toDate?: () => Date })?.toDate?.().toISOString() ?? null,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
    updatedAt:
      (data.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
      new Date().toISOString(),
  };
}

export const firestoreDiscountRepository: DiscountRepository = {
  async findAll(): Promise<Discount[]> {
    const q = query(collection(db, "discounts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<Discount | null> {
    const snap = await getDoc(doc(db, "discounts", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async findByCode(code: string): Promise<Discount | null> {
    const q = query(
      collection(db, "discounts"),
      where("code", "==", code.toUpperCase()),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return mapDoc(d.id, d.data() as Record<string, unknown>);
  },

  async create(input: CreateDiscountInput): Promise<Discount> {
    const payload = Object.fromEntries(
      Object.entries({ ...input, code: input.code.toUpperCase() }).filter(
        ([, v]) => v !== undefined
      )
    );
    const docRef = await addDoc(collection(db, "discounts"), {
      ...payload,
      usedCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, input: UpdateDiscountInput): Promise<void> {
    const payload = Object.fromEntries(
      Object.entries({
        ...input,
        ...(input.code ? { code: input.code.toUpperCase() } : {}),
      }).filter(([, v]) => v !== undefined)
    );
    await updateDoc(doc(db, "discounts", id), {
      ...payload,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, "discounts", id));
  },

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, "discounts", id), {
      isActive,
      updatedAt: serverTimestamp(),
    });
  },
};
