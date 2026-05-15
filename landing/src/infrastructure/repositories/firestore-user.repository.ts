import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { UserRepository } from "@/domain/repositories/user.repository";
import type { User } from "@/domain/entities/user.entity";

export const firestoreUserRepository: UserRepository = {
  async findById(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      uid,
      name: data["name"] ?? "",
      email: data["email"] ?? null,
      phone: data["phone"] ?? null,
      departamento: data["departamento"] ?? null,
      birthDate: data["birthDate"] ?? null,
      role: data["role"] ?? "customer",
      createdAt: data["createdAt"]?.toDate?.()?.toISOString() ?? null,
      updatedAt: data["updatedAt"]?.toDate?.()?.toISOString() ?? null,
    };
  },

  async update(uid, data): Promise<void> {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },
};
