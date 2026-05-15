import { useState, useEffect, type FormEvent } from "react";
import {
  collection, getDocs, doc, setDoc, updateDoc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus, Eye, EyeOff, ShieldCheck, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import type { AdminRole } from "../context/AuthContext";

interface AdminUserRow {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: { seconds: number } | null;
}

// ── Crear usuario vía Firebase Auth REST API (sin cerrar sesión actual) ──────
async function createAuthUser(email: string, password: string): Promise<string> {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    }
  );
  const data = await res.json() as { localId?: string; error?: { message: string } };
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? "Error al crear usuario en Firebase Auth.");
  }
  return data.localId!;
}

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AdminRole>("admin");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // ── Carga lista ────────────────────────────────────────────────────────────
  async function loadUsers() {
    setLoadingList(true);
    try {
      const snap = await getDocs(
        query(collection(db, "adminUsers"), orderBy("createdAt", "desc"))
      );
      setUsers(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            uid: d.id,
            name: data["name"] ?? "",
            email: data["email"] ?? "",
            role: data["role"] as AdminRole,
            isActive: data["isActive"] ?? true,
            createdAt: data["createdAt"] ?? null,
          };
        })
      );
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => { void loadUsers(); }, []);

  // ── Toggle activo/inactivo ─────────────────────────────────────────────────
  async function toggleActive(uid: string, current: boolean) {
    // No desactivar la propia cuenta
    if (uid === currentUser?.uid) return;
    await updateDoc(doc(db, "adminUsers", uid), { isActive: !current });
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, isActive: !current } : u))
    );
  }

  // ── Crear nuevo admin ──────────────────────────────────────────────────────
  function openModal() {
    setName(""); setEmail(""); setPassword("");
    setRole("admin"); setFormError(""); setShowPassword(false);
    setShowModal(true);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setFormLoading(true);
    try {
      const uid = await createAuthUser(email.trim(), password);

      await setDoc(doc(db, "adminUsers", uid), {
        name: name.trim(),
        email: email.trim(),
        role,
        isActive: true,
        createdBy: currentUser?.uid ?? "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setShowModal(false);
      void loadUsers();
    } catch (err: unknown) {
      const msg = (err as Error).message ?? "";
      if (msg.includes("EMAIL_EXISTS")) {
        setFormError("Este correo ya está registrado.");
      } else if (msg.includes("WEAK_PASSWORD")) {
        setFormError("La contraseña es demasiado débil.");
      } else {
        setFormError(msg || "No se pudo crear el usuario.");
      }
    } finally {
      setFormLoading(false);
    }
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Usuarios Administrativos"
        subtitle="Gestión de acceso al panel de VOUS."
      />

      <div className="flex justify-end">
        <Button onClick={openModal}>
          <UserPlus size={14} />
          Nuevo Administrador
        </Button>
      </div>

      <div className="bg-vous-white border border-vous-border overflow-hidden">
        {loadingList ? (
          <div className="flex justify-center py-16">
            <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-vous-gray font-nav">No hay usuarios registrados.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Nombre", "Correo", "Rol", "Estado", "Acciones"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-vous-cream border border-vous-border flex items-center justify-center text-[10px] font-nav text-vous-gray uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-sans text-vous-black">
                        {u.name}
                        {u.uid === currentUser?.uid && (
                          <span className="ml-1.5 text-[10px] text-vous-gold font-nav">(tú)</span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-vous-gray font-sans">{u.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-nav uppercase tracking-wider border ${u.role === "superadmin" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                      {u.role === "superadmin" ? <ShieldCheck size={10} /> : <Shield size={10} />}
                      {u.role === "superadmin" ? "Superadmin" : "Admin"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? "active" : "inactive"}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(u.uid, u.isActive)}
                      disabled={u.uid === currentUser?.uid}
                      title={u.uid === currentUser?.uid ? "No puedes desactivar tu propia cuenta" : u.isActive ? "Desactivar" : "Activar"}
                      className="text-vous-gray hover:text-vous-black disabled:opacity-30 transition-colors"
                    >
                      {u.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Modal nuevo admin ──────────────────────────────────────────────── */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Administrador</DialogTitle>
            <DialogDescription>
              El usuario podrá acceder al panel inmediatamente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-5">

            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                Nombre Completo
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="María García"
              />
            </div>

            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                Correo Electrónico
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vous.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                Contraseña Temporal
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-gray hover:text-vous-black transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-vous-gray/60 font-sans mt-1">
                Comparte esta contraseña con el usuario para que ingrese.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-1.5">
                Rol
              </label>
              <div className="flex gap-3">
                {(["admin", "superadmin"] as AdminRole[]).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setRole(r)}
                  >
                    {r === "superadmin" ? <ShieldCheck size={12} /> : <Shield size={12} />}
                    {r === "superadmin" ? "Superadmin" : "Admin"}
                  </Button>
                ))}
              </div>
            </div>

            {formError && (
              <div className="border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs text-red-600 font-sans">{formError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading} className="flex-1">
                {formLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserPlus size={13} />
                )}
                {formLoading ? "Creando..." : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
