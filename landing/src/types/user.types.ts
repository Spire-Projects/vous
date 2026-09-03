import type { BaseDocument } from "./base.types";

// ── Colección: users ────────────────────────────────────────────────────────

/** Roles de un cliente en la plataforma */
export type CustomerRole = "customer" | "wholesale";

/** Estado de la solicitud mayorista del cliente */
export type WholesaleStatus = "none" | "pending" | "approved" | "rejected";

/**
 * Perfil de cliente almacenado en Firestore.
 * Ruta: users/{userId}
 * El documento ID coincide con el UID de Firebase Auth.
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

/** Datos del cliente capturados como snapshot inmutable al crear un pedido */
export interface CustomerSnapshot {
  name: string;
  email: string;
  phone: string;
  department: string;
}

/** Payload para crear un nuevo usuario */
export type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;

/** Payload para actualizar un usuario */
export type UpdateUserPayload = Partial<Omit<User, "id" | "uid" | "createdAt" | "updatedAt">>;
