export type UserRole = "customer" | "wholesaler" | "admin" | "superadmin";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole | null;
}

/** Document stored in Firestore `users/{uid}` */
export interface UserProfile {
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

export interface AuthContextValue {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  createAccount: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    departamento?: string
  ) => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, "name" | "phone" | "departamento" | "birthDate">>) => Promise<void>;
  signOut: () => Promise<void>;
}
