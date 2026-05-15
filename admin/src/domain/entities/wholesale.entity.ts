/**
 * Wholesale entity — dominio puro.
 */
export type WholesaleRequestStatus = "pending" | "approved" | "rejected";

export interface WholesaleRequest {
  id: string;
  userId?: string;
  // ── Datos personales del distribuidor ──────────────────
  contactName: string;
  carnetIdentidad?: string;
  phone: string;
  department: string;
  // ── Datos del negocio / distribución ──────────────────
  distributionAddress?: string;
  howFound?: string;
  onlineStoreFiles?: string[];
  // ── Campos legacy (compatibilidad) ────────────────────
  businessName?: string;
  email?: string;
  city?: string;
  message?: string;
  // ── Estado de revisión ────────────────────────────────
  status: WholesaleRequestStatus;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt?: unknown;
  reviewedAt?: unknown;
}

export interface ReviewWholesaleInput {
  requestId: string;
  status: "approved" | "rejected";
  reviewNote?: string;
  reviewedBy: string;
}
