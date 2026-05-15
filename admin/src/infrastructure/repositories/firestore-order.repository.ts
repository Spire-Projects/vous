import {
  collection, getDocs, doc, getDoc, updateDoc,
  query, orderBy, where, limit as fsLimit, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

function mapOrder(d: { id: string; data: () => Record<string, unknown> }): Order {
  const data = d.data();
  return {
    id: d.id,
    orderNumber: data["orderNumber"] as string,
    customer: {
      uid: (data["customerId"] as string) ?? "",
      name: (data["customerSnapshot"] as { name?: string })?.name ?? "",
      email: (data["customerSnapshot"] as { email?: string })?.email ?? "",
    },
    items: (data["items"] as Order["items"]) ?? [],
    subtotal: data["subtotal"] as number,
    total: data["total"] as number,
    status: data["status"] as Order["status"],
    paymentMethod: data["paymentMethod"] as Order["paymentMethod"],
    isWholesale: data["isWholesale"] as boolean,
    adminNotes: data["adminNotes"] as string | undefined,
    createdAt: data["createdAt"],
    updatedAt: data["updatedAt"],
  };
}

export const firestoreOrderRepository: OrderRepository = {
  async findAll(limitCount?: number): Promise<Order[]> {
    const q = limitCount
      ? query(collection(db, "orders"), orderBy("createdAt", "desc"), fsLimit(limitCount))
      : query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapOrder({ id: d.id, data: d.data }));
  },

  async findById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) return null;
    return mapOrder({ id: snap.id, data: snap.data });
  },

  async findByStatus(status: Order["status"]): Promise<Order[]> {
    const q = query(collection(db, "orders"), where("status", "==", status));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapOrder({ id: d.id, data: d.data }));
  },

  async updateStatus({ orderId, status, adminNotes }: UpdateOrderStatusInput): Promise<void> {
    const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
    if (adminNotes !== undefined) updates["adminNotes"] = adminNotes;
    await updateDoc(doc(db, "orders", orderId), updates);
  },
};
