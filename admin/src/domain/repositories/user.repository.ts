import type { Customer, AdminUser } from "@/domain/entities/user.entity";

export interface CustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  setActive(uid: string, isActive: boolean): Promise<void>;
}

export interface AdminUserRepository {
  findAll(): Promise<AdminUser[]>;
  setActive(uid: string, isActive: boolean): Promise<void>;
  setRole(uid: string, role: AdminUser["role"]): Promise<void>;
}
