import { useState, useEffect, type FormEvent } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/ui/PageHeader";
import { UserPlus, Eye, EyeOff, ShieldCheck, Shield, ToggleLeft, ToggleRight, X } from "lucide-react";
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

      {/* Acción */}
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
        >
          <UserPlus size={14} />
          Nuevo Administrador
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#E8E5E1] overflow-hidden">
        {loadingList ? (
          <div className="flex justify-center py-16">
            <span className="inline-block w-5 h-5 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[#9E9E9E] font-['Montserrat']">
              No hay usuarios registrados.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E5E1]">
                {["Nombre", "Correo", "Rol", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.uid}
                  className="border-b border-[#E8E5E1] last:border-0 hover:bg-[#F9F8F7] transition-colors"
                >
                  {/* Nombre */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#F2F1F0] border border-[#E8E5E1] flex items-center justify-center text-[10px] font-['Montserrat'] text-[#9E9E9E] uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-['Inter'] text-[#1A1A1A]">
                        {u.name}
                        {u.uid === currentUser?.uid && (
                          <span className="ml-1.5 text-[10px] text-[#C9A84C] font-['Montserrat']">(tú)</span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Correo */}
                  <td className="px-5 py-4 text-[#666] font-['Inter']">
                    {u.email}
                  </td>

                  {/* Rol */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-['Montserrat'] uppercase tracking-wider ${
                        u.role === "superadmin"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}
                    >
                      {u.role === "superadmin" ? (
                        <ShieldCheck size={10} />
                      ) : (
                        <Shield size={10} />
                      )}
                      {u.role === "superadmin" ? "Superadmin" : "Admin"}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-['Montserrat'] uppercase tracking-wider ${
                        u.isActive
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    >
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(u.uid, u.isActive)}
                      disabled={u.uid === currentUser?.uid}
                      title={
                        u.uid === currentUser?.uid
                          ? "No puedes desactivar tu propia cuenta"
                          : u.isActive
                          ? "Desactivar"
                          : "Activar"
                      }
                      className="text-[#9E9E9E] hover:text-[#1A1A1A] disabled:opacity-30 transition-colors"
                    >
                      {u.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal nuevo admin ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />

          {/* Card */}
          <div className="relative z-10 bg-white border border-[#E8E5E1] w-full max-w-md mx-4 p-8 shadow-xl">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-['Bodoni_Moda'] text-xl text-[#1A1A1A]">
                  Nuevo Administrador
                </h2>
                <p className="text-[11px] text-[#9E9E9E] font-['Montserrat'] mt-0.5">
                  El usuario podrá acceder al panel inmediatamente.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">

              {/* Nombre */}
              <div>
                <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#E8E5E1] px-3 py-2.5 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors bg-white"
                  placeholder="María García"
                />
              </div>

              {/* Correo */}
              <div>
                <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E8E5E1] px-3 py-2.5 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors bg-white"
                  placeholder="admin@vous.com"
                />
              </div>

              {/* Contraseña temporal */}
              <div>
                <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                  Contraseña Temporal
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[#E8E5E1] px-3 py-2.5 pr-10 text-sm font-['Inter'] focus:outline-none focus:border-[#C9A84C] transition-colors bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-[#BDBDBD] font-['Inter'] mt-1">
                  Comparte esta contraseña con el usuario para que ingrese.
                </p>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-[10px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] mb-1.5">
                  Rol
                </label>
                <div className="flex gap-3">
                  {(["admin", "superadmin"] as AdminRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-['Montserrat'] uppercase tracking-wider border transition-colors ${
                        role === r
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#9E9E9E] border-[#E8E5E1] hover:border-[#1A1A1A]"
                      }`}
                    >
                      {r === "superadmin" ? <ShieldCheck size={12} /> : <Shield size={12} />}
                      {r === "superadmin" ? "Superadmin" : "Admin"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div className="border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600 font-['Inter']">{formError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#E8E5E1] text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] text-[#9E9E9E] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-['Montserrat'] uppercase tracking-[0.15em] hover:bg-[#333] disabled:opacity-50 transition-colors"
                >
                  {formLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <UserPlus size={13} />
                  )}
                  {formLoading ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
