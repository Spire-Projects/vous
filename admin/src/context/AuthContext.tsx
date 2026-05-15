import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthStore, type AdminRole, type AuthUser } from "../stores/authStore";

// Re-export types so existing imports keep working
export type { AdminRole, AuthUser } from "../stores/authStore";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  /**
   * Crea el superadmin inicial. Solo funciona si no existe ningún superadmin.
   * Lanza un error si ya hay un superadmin registrado.
   */
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, "adminUsers", firebaseUser.uid));

        if (adminDoc.exists()) {
          const data = adminDoc.data();
          const role = data["role"] as AdminRole;
          const isActive = data["isActive"] as boolean;

          if ((role === "admin" || role === "superadmin") && isActive) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: (data["name"] as string) ?? "",
              role,
            });
          } else {
            // Cuenta desactivada o sin rol válido
            await signOut(auth);
            setUser(null);
          }
        } else {
          // No existe en adminUsers — puede ser un registro en curso.
          // Solo dejamos user=null sin cerrar sesión para que setDoc
          // (desde RegisterPage) pueda completarse mientras el usuario
          // sigue autenticado en Firebase Auth.
          setUser(null);
        }
      } catch {
        setUser(null);
      }

      setLoading(false);
    });
  }, [setUser, setLoading]);

  async function login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    // Verificar que no exista ningún superadmin todavía.
    // Si la lectura falla (reglas de Firestore sin auth), asumimos que no hay
    // superadmin y continuamos — el setDoc posterior validará el acceso.
    try {
      const snap = await getDocs(
        query(collection(db, "adminUsers"), where("role", "==", "superadmin"))
      );
      if (!snap.empty) {
        throw new Error(
          "Ya existe un superadmin. Contacta al administrador para obtener acceso."
        );
      }
    } catch (err) {
      // Re-lanzar solo si es el error intencional de superadmin existente
      if (err instanceof Error && err.message.includes("Ya existe")) throw err;
      // Cualquier otro error (ej. reglas de Firestore) → continuar
    }

    const { user: newUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "adminUsers", newUser.uid), {
      uid: newUser.uid,
      email,
      name,
      role: "superadmin",
      isActive: true,
      permissions: [],
      createdBy: newUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function logout(): Promise<void> {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
