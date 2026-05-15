import type { BaseDocument } from "./base.types";

// ── Colección: users ────────────────────────────────────────────────────────

export type CustomerRole = "customer" | "wholesale";
export type WholesaleStatus = "none" | "pending" | "approved" | "rejected";

/**
 * Perfil de cliente. Ruta: users/{userId}
 */
export interface User extends BaseDocument {
  uid: string;
  email: string;
  name: string;
  phone: string;
  department: string;
  role: CustomerRole;
  wholesaleStatus: WholesaleStatus;
  isActive: boolean;
}

export interface CustomerSnapshot {
  name: string;
  email: string;
  phone: string;
  department: string;
}

export type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserPayload = Partial<
  Omit<User, "id" | "uid" | "createdAt" | "updatedAt">
>;

// ── Colección: adminUsers ───────────────────────────────────────────────────

/** Roles del panel administrativo */
export type AdminRole = "superadmin" | "admin";

/**
 * Perfil de administrador. Ruta: adminUsers/{userId}
 * Colección separada de `users` por seguridad.
 */
export interface AdminUser extends BaseDocument {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  /** Permisos granulares — reservado para expansión futura */
  permissions?: string[];
  /** UID del superadmin que creó esta cuenta */
  createdBy: string;
}

export type CreateAdminUserPayload = Omit<
  AdminUser,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateAdminUserPayload = Partial<
  Omit<AdminUser, "id" | "uid" | "createdAt" | "updatedAt" | "createdBy">
>;
