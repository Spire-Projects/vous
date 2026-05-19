import {
  collection, getDocs, doc, getDoc, updateDoc,
  query, orderBy, where, limit as fsLimit, serverTimestamp,
  onSnapshot, runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order, OrderItem, ShippingInfo, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

function toISO(ts: unknown): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts === "string") return ts;
  if (ts && typeof ts === "object" && "toDate" in ts) {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

function mapOrder(d: { id: string; data: () => Record<string, unknown> }): Order {
  const data = d.data();
  const snapshot = data["customerSnapshot"] as
    | { name?: string; email?: string; phone?: string; department?: string }
    | undefined;
  const shippingRaw = data["shippingInfo"] as Record<string, unknown> | undefined;
  const shipping: ShippingInfo | undefined = shippingRaw
    ? {
        fullName: (shippingRaw["fullName"] as string) ?? "",
        phone: (shippingRaw["phone"] as string) ?? "",
        department: (shippingRaw["department"] as string) ?? "",
        city: (shippingRaw["city"] as string) ?? "",
        address: (shippingRaw["address"] as string) ?? "",
        shippingType: (shippingRaw["shippingType"] as "local" | "national") ?? "local",
        carrier: shippingRaw["carrier"] as string | undefined,
        trackingInfo: shippingRaw["trackingInfo"] as string | undefined,
      }
    : undefined;

  return {
    id: d.id,
    orderNumber: (data["orderNumber"] as string) ?? d.id,
    customer: {
      uid: (data["customerId"] as string) ?? (data["userId"] as string) ?? "",
      name: snapshot?.name ?? (data["customerName"] as string) ?? "",
      email: snapshot?.email ?? (data["customerEmail"] as string) ?? "",
      phone: snapshot?.phone,
      department: snapshot?.department,
    },
    items: (data["items"] as OrderItem[]) ?? [],
    subtotal: (data["subtotal"] as number) ?? 0,
    discountAmount: data["discountAmount"] as number | undefined,
    total: (data["total"] as number) ?? 0,
    status: (data["status"] as Order["status"]) ?? "pending",
    paymentMethod: (data["paymentMethod"] as Order["paymentMethod"]) ?? "qr",
    paymentProof: data["paymentProof"] as string | undefined,
    shippingInfo: shipping,
    isWholesale: (data["isWholesale"] as boolean) ?? false,
    discountCode: data["discountCode"] as string | undefined,
    carrierRef: data["carrierRef"] as string | undefined,
    adminNotes: data["adminNotes"] as string | undefined,
    createdAt: toISO(data["createdAt"]),
    updatedAt: toISO(data["updatedAt"]),
  };
}

function buildQuery(limitCount?: number) {
  return limitCount
    ? query(collection(db, "orders"), orderBy("createdAt", "desc"), fsLimit(limitCount))
    : query(collection(db, "orders"), orderBy("createdAt", "desc"));
}

export const firestoreOrderRepository: OrderRepository = {
  async findAll(limitCount?: number): Promise<Order[]> {
    const snap = await getDocs(buildQuery(limitCount));
    return snap.docs.map((d) => mapOrder({ id: d.id, data: d.data.bind(d) }));
  },

  async findById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) return null;
    return mapOrder({ id: snap.id, data: snap.data.bind(snap) });
  },

  async findByStatus(status: Order["status"]): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapOrder({ id: d.id, data: d.data.bind(d) }));
  },

  async updateStatus({ orderId, status, adminNotes }: UpdateOrderStatusInput): Promise<void> {
    const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
    if (adminNotes !== undefined) updates["adminNotes"] = adminNotes;
    await updateDoc(doc(db, "orders", orderId), updates);
  },

  subscribeAll(onNext: (orders: Order[]) => void, limitCount?: number): () => void {
    return onSnapshot(buildQuery(limitCount), (snap) => {
      onNext(snap.docs.map((d) => mapOrder({ id: d.id, data: d.data.bind(d) })));
    });
  },

  async cancelAndRestoreStock(orderId: string, adminNotes?: string): Promise<void> {
    const orderRef = doc(db, "orders", orderId);
    await runTransaction(db, async (transaction) => {
      // ── All reads first ─────────────────────────────────────────────────
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) throw new Error("Pedido no encontrado");

      const items = (orderSnap.data()["items"] ?? []) as Array<{
        productId: string;
        quantity: number;
      }>;
      const productRefs = items.map((item) => doc(db, "products", item.productId));
      const productSnaps = await Promise.all(productRefs.map((ref) => transaction.get(ref)));

      // ── All writes ───────────────────────────────────────────────────────
      productSnaps.forEach((snap, i) => {
        if (snap.exists()) {
          transaction.update(productRefs[i], {
            stock: ((snap.data()["stock"] as number) ?? 0) + items[i].quantity,
            updatedAt: serverTimestamp(),
          });
        }
      });

      const orderUpdates: Record<string, unknown> = {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      };
      if (adminNotes !== undefined) orderUpdates["adminNotes"] = adminNotes;
      transaction.update(orderRef, orderUpdates);
    });
  },

  async updateNotes(orderId: string, notes: string): Promise<void> {
    await updateDoc(doc(db, "orders", orderId), {
      adminNotes: notes,
      updatedAt: serverTimestamp(),
    });
  },
};
