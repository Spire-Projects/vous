import { collection, getDocs, doc, getDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CustomerRepository, AdminUserRepository } from "@/domain/repositories/user.repository";
import type { Customer, AdminUser } from "@/domain/entities/user.entity";

export const firestoreCustomerRepository: CustomerRepository = {
  async findAll(): Promise<Customer[]> {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Customer);
  },

  async findById(id: string): Promise<Customer | null> {
    const snap = await getDoc(doc(db, "users", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Customer;
  },

  async setActive(uid: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, "users", uid), { isActive });
  },
};

export const firestoreAdminUserRepository: AdminUserRepository = {
  async findAll(): Promise<AdminUser[]> {
    const snap = await getDocs(collection(db, "adminUsers"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminUser);
  },

  async setActive(uid: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, "adminUsers", uid), { isActive });
  },

  async setRole(uid: string, role: AdminUser["role"]): Promise<void> {
    await updateDoc(doc(db, "adminUsers", uid), { role });
  },
};
