import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order } from "@/domain/entities/order.entity";

export const firestoreOrderRepository: OrderRepository = {
  async findByUser(userId: string): Promise<Order[]> {
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
  },

  async findById(id: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Order;
  },

  async create(order): Promise<Order> {
    const ref = await addDoc(collection(db, "orders"), {
      ...order,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ...order, id: ref.id, status: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },
};
