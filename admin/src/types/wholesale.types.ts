import type { BaseDocument, AnyTimestamp } from "./base.types";

export type WholesaleRequestStatus = "pending" | "approved" | "rejected";

/**
 * Solicitud de cliente mayorista. Ruta: wholesaleRequests/{requestId}
 */
export interface WholesaleRequest extends BaseDocument {
  userId?: string;
  status: WholesaleRequestStatus;
  businessName: string;
  businessType: string;
  ownerName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  nit?: string;
  message?: string;
  reviewedBy?: string;
  reviewedAt?: AnyTimestamp;
  reviewNotes?: string;
}

export type CreateWholesaleRequestPayload = Omit<
  WholesaleRequest,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "reviewedBy"
  | "reviewedAt"
  | "reviewNotes"
>;

export type ReviewWholesaleRequestPayload = Pick<
  WholesaleRequest,
  "status" | "reviewedBy" | "reviewedAt" | "reviewNotes"
>;

/**
 * Reglas comerciales mayoristas. Ruta: wholesaleRules/main
 */
export interface WholesaleRules {
  minimumPurchaseAmount: number;
  minimumPurchaseUnits: number;
  discountPercentage: number;
  allowSizeSelection: boolean;
  restrictions: string[];
  notes?: string;
  updatedAt: AnyTimestamp;
}
