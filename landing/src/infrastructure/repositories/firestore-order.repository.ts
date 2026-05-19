import { getFirebaseDb } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order, CreateOrderInput } from "@/domain/entities/order.entity";

function toISO(ts: unknown): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts === "string") return ts;
  if (ts && typeof ts === "object" && "toDate" in ts) {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

function mapDoc(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    orderNumber: (data["orderNumber"] as string) ?? id,
    customerId: (data["customerId"] as string) ?? (data["userId"] as string) ?? "",
    customerSnapshot: (data["customerSnapshot"] as Order["customerSnapshot"]) ?? {
      name: "",
      email: "",
    },
    items: (data["items"] as Order["items"]) ?? [],
    subtotal: (data["subtotal"] as number) ?? 0,
    discountAmount: data["discountAmount"] as number | undefined,
    discountCode: data["discountCode"] as string | undefined,
    total: (data["total"] as number) ?? 0,
    status: (data["status"] as Order["status"]) ?? "pending",
    paymentMethod: (data["paymentMethod"] as Order["paymentMethod"]) ?? "qr",
    paymentProof: data["paymentProof"] as string | undefined,
    shippingInfo: data["shippingInfo"] as Order["shippingInfo"],
    isWholesale: (data["isWholesale"] as boolean) ?? false,
    adminNotes: data["adminNotes"] as string | undefined,
    carrierRef: data["carrierRef"] as string | undefined,
    createdAt: toISO(data["createdAt"]),
    updatedAt: toISO(data["updatedAt"]),
  };
}

export const firestoreOrderRepository: OrderRepository = {
  async findByUser(userId: string): Promise<Order[]> {
    const q = query(collection(getFirebaseDb(), "orders"), where("customerId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>));
  },

  async findById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(getFirebaseDb(), "orders", id));
    if (!snap.exists()) return null;
    return mapDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const orderNumber = `VOUS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const ref = await addDoc(collection(getFirebaseDb(), "orders"), {
      ...input,
      orderNumber,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      orderNumber,
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updatePaymentProof(orderId: string, proofUrl: string): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), "orders", orderId), {
      paymentProof: proofUrl,
      status: "payment_sent",
      updatedAt: serverTimestamp(),
    });
  },
};
