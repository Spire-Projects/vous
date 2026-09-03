export type UserRole = "customer" | "wholesaler" | "admin" | "superadmin";

export interface User {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  departamento: string | null;
  birthDate: string | null;
  role: UserRole;
  createdAt: string | null;
  updatedAt: string | null;
}
