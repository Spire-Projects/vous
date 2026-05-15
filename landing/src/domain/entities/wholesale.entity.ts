export type WholesaleStatus = "pending" | "approved" | "rejected";

export interface WholesaleRequest {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  departamento: string;
  status: WholesaleStatus;
  createdAt?: string;
}
