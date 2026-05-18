import type { BaseDocument, AnyTimestamp } from "./base.types";

// ── Colección: wholesaleRequests ────────────────────────────────────────────

export type WholesaleRequestStatus = "pending" | "approved" | "rejected";

/**
 * Solicitud de cliente mayorista.
 * Ruta: wholesaleRequests/{requestId}
 *
 * Al aprobar: actualizar users/{userId}.role = "wholesale"
 *             y users/{userId}.wholesaleStatus = "approved"
 */
export interface WholesaleRequest extends BaseDocument {
  /** Referencia a users/{userId} — presente si el usuario estaba autenticado */
  userId?: string;
  status: WholesaleRequestStatus;
  businessName: string;
  /** Tipo de negocio: tienda, distribuidora, revendedora, etc. */
  businessType: string;
  ownerName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  nit?: string;
  message?: string;
  /** UID del admin que revisó la solicitud */
  reviewedBy?: string;
  reviewedAt?: AnyTimestamp;
  reviewNotes?: string;
}

export type CreateWholesaleRequestPayload = Omit<
  WholesaleRequest,
  "id" | "createdAt" | "updatedAt" | "status" | "reviewedBy" | "reviewedAt" | "reviewNotes"
>;

export type ReviewWholesaleRequestPayload = Pick<
  WholesaleRequest,
  "status" | "reviewedBy" | "reviewedAt" | "reviewNotes"
>;

// ── Documento: wholesaleRules/main ──────────────────────────────────────────

/**
 * Reglas comerciales para clientes mayoristas.
 * Ruta: wholesaleRules/main (documento único)
 */
export interface WholesaleRules {
  /** Monto mínimo de compra en BOB */
  minimumPurchaseAmount: number;
  /** Cantidad mínima de unidades */
  minimumPurchaseUnits: number;
  /** Porcentaje de descuento mayorista sobre precio minorista */
  discountPercentage: number;
  /** Si los mayoristas pueden seleccionar talla individual */
  allowSizeSelection: boolean;
  /** Lista de restricciones visibles al cliente */
  restrictions: string[];
  /** Notas adicionales sobre las reglas */
  notes?: string;
  updatedAt: AnyTimestamp;
}
