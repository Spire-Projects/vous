import { useState, useCallback, useEffect } from "react";
import { Users, Shield, Search, UserCheck, ToggleLeft, ToggleRight, Eye, Filter, UserPlus, ShieldCheck, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useCustomers } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import type { Customer, CustomerRole } from "@/domain/entities/user.entity";
import type { AdminRole } from "@/context/AuthContext";
import {
  collection, getDocs, doc, setDoc, updateDoc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─────────────────── Types & Helpers ─────────────────── */

type UserTab = "clients" | "admins";

type ClientFilter = "all" | "active" | "inactive" | "wholesaler";

const CLIENT_TABS: { label: string; value: ClientFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
  { label: "Mayoristas", value: "wholesaler" },
];

const roleVariantMap: Record<CustomerRole, BadgeProps["variant"]> = {
  customer: "outline",
  wholesaler: "gold",
};

const roleLabelMap: Record<CustomerRole, string> = {
  customer: "Cliente",
  wholesaler: "Mayorista",
};

function formatDate(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }
  return "—";
}

interface AdminUserRow {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: { seconds: number } | null;
}

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

/* ─────────────────── Page ─────────────────── */

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<UserTab>("clients");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Usuarios"
        subtitle="Gestiona clientes y administradores del sistema."
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/40 pb-1">
        <button
          onClick={() => setActiveTab("clients")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "clients"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Users size={14} strokeWidth={1.5} />
          Clientes
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "admins"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Shield size={14} strokeWidth={1.5} />
          Administradores
        </button>
      </div>

      {activeTab === "clients" && <ClientsTab />}
      {activeTab === "admins" && <AdminsTab />}
    </div>
  );
}

/* ─────────────────── Clients Tab ─────────────────── */

function ClientsTab() {
  const { customers, loading, error, toggleActive } = useCustomers();
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState<ClientFilter>("all");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const matchTab =
      clientFilter === "all" ||
      (clientFilter === "active" && c.isActive) ||
      (clientFilter === "inactive" && !c.isActive) ||
      (clientFilter === "wholesaler" && c.role === "wholesaler");
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? "").includes(q);
    return matchTab && matchSearch;
  });

  const totalActive = customers.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total Clientes" value={loading ? "—" : String(customers.length)} icon={<Users size={24} strokeWidth={1} />} />
        <StatCard label="Clientes Activos" value={loading ? "—" : String(totalActive)} icon={<UserCheck size={24} strokeWidth={1} />} />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-4 border-b border-white/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-secondary" />
            <Input placeholder="Buscar por nombre, correo o teléfono…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-1">
            {CLIENT_TABS.map((tab) => (
              <Button key={tab.value} size="sm" variant={clientFilter === tab.value ? "default" : "outline"} onClick={() => setClientFilter(tab.value)}>
                <Filter size={12} />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="inline-block w-5 h-5 border-2 border-vous-border border-t-vous-gold rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center"><p className="text-sm text-red-600 font-nav">{error}</p></div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-white/30">
              {filtered.map((customer) => (
                <div key={customer.id} className="p-4 space-y-3">
                  <div>
                    <p className="text-[13px] font-sans text-vous-text font-medium">{customer.name}</p>
                    <p className="text-[11px] text-vous-text-secondary">{customer.email}</p>
                  </div>
                  <div><p className="text-[10px] font-nav uppercase text-vous-text-secondary">Teléfono</p><p className="text-[12px] font-sans text-vous-text-secondary">{customer.phone ?? "—"}</p></div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Tipo</p>
                    <Badge variant={roleVariantMap[customer.role]}>{roleLabelMap[customer.role]}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Estado</p>
                    <Badge variant={customer.isActive ? "active" : "inactive"}>{customer.isActive ? "Activo" : "Inactivo"}</Badge>
                  </div>
                  <div><p className="text-[10px] font-nav uppercase text-vous-text-secondary">Registro</p><p className="text-[12px] font-sans text-vous-text-secondary">{formatDate(customer.createdAt)}</p></div>
                  <div className="flex items-center gap-3 pt-1">
                    <button title="Ver detalle" onClick={() => setSelected(customer)} className="text-vous-text-secondary hover:text-vous-text transition-colors"><Eye size={16} strokeWidth={1.5} /></button>
                    <button title={customer.isActive ? "Desactivar cuenta" : "Activar cuenta"} onClick={() => void toggleActive(customer.uid, customer.isActive)} className={`transition-colors ${customer.isActive ? "text-green-600 hover:text-red-700" : "text-vous-text-secondary hover:text-green-700"}`}>
                      {customer.isActive ? <ToggleRight size={18} strokeWidth={1.5} /> : <ToggleLeft size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-vous-text-secondary text-sm font-nav">{search ? "No se encontraron clientes con ese filtro." : "No hay clientes registrados."}</div>
              )}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Cliente", "Teléfono", "Tipo", "Estado", "Registro", "Acciones"].map((h) => <TableHead key={h}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <p className="text-[13px] font-sans text-vous-text font-medium">{customer.name}</p>
                        <p className="text-[11px] text-vous-text-secondary">{customer.email}</p>
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">{customer.phone ?? "—"}</TableCell>
                      <TableCell><Badge variant={roleVariantMap[customer.role]}>{roleLabelMap[customer.role]}</Badge></TableCell>
                      <TableCell><Badge variant={customer.isActive ? "active" : "inactive"}>{customer.isActive ? "Activo" : "Inactivo"}</Badge></TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button title="Ver detalle" onClick={() => setSelected(customer)} className="text-vous-text-secondary hover:text-vous-text transition-colors"><Eye size={16} strokeWidth={1.5} /></button>
                          <button title={customer.isActive ? "Desactivar cuenta" : "Activar cuenta"} onClick={() => void toggleActive(customer.uid, customer.isActive)} className={`transition-colors ${customer.isActive ? "text-green-600 hover:text-red-700" : "text-vous-text-secondary hover:text-green-700"}`}>
                            {customer.isActive ? <ToggleRight size={18} strokeWidth={1.5} /> : <ToggleLeft size={18} strokeWidth={1.5} />}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="py-12 text-center text-vous-text-secondary text-sm font-nav">{search ? "No se encontraron clientes con ese filtro." : "No hay clientes registrados."}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && !error && (
          <div className="px-4 py-3 border-t border-white/40">
            <p className="text-[11px] text-vous-text-secondary font-nav">Mostrando {filtered.length} de {customers.length} clientes</p>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open: boolean) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.email}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Teléfono</p>
                  <p className="font-sans text-vous-text">{selected.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Tipo de Cuenta</p>
                  <Badge variant={roleVariantMap[selected.role]}>{roleLabelMap[selected.role]}</Badge>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Estado</p>
                  <Badge variant={selected.isActive ? "active" : "inactive"}>{selected.isActive ? "Activo" : "Inactivo"}</Badge>
                </div>
                <div>
                  <p className="text-[10px] font-nav uppercase tracking-wider text-vous-text-secondary mb-0.5">Registro</p>
                  <p className="font-sans text-vous-text">{formatDate(selected.createdAt)}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/40 flex justify-end gap-2">
                <Button size="sm" variant={selected.isActive ? "outline" : "gold"} onClick={() => { void toggleActive(selected.uid, selected.isActive); setSelected((prev) => prev ? { ...prev, isActive: !prev.isActive } : null); }}>
                  {selected.isActive ? <><ToggleLeft size={14} /> Desactivar cuenta</> : <><ToggleRight size={14} /> Activar cuenta</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─────────────────── Admins Tab ─────────────────── */

function AdminsTab() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AdminRole>("admin");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoadingList(true);
    try {
      const snap = await getDocs(query(collection(db, "adminUsers"), orderBy("createdAt", "desc")));
      setUsers(snap.docs.map((d) => {
        const data = d.data();
        return { uid: d.id, name: data["name"] ?? "", email: data["email"] ?? "", role: data["role"] as AdminRole, isActive: data["isActive"] ?? true, createdAt: data["createdAt"] ?? null };
      }));
    } finally { setLoadingList(false); }
  }, []);

  const [initDone, setInitDone] = useState(false);
  useEffect(() => {
    if (!initDone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitDone(true);
      void loadUsers();
    }
  }, [initDone, loadUsers]);

  async function toggleActive(uid: string, current: boolean) {
    if (uid === currentUser?.uid) return;
    await updateDoc(doc(db, "adminUsers", uid), { isActive: !current });
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, isActive: !current } : u)));
  }

  function openModal() {
    setName(""); setEmail(""); setPassword(""); setRole("admin"); setFormError(""); setShowPassword(false); setShowModal(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (password.length < 8) { setFormError("La contraseña debe tener al menos 8 caracteres."); return; }
    setFormLoading(true);
    try {
      const uid = await createAuthUser(email.trim(), password);
      await setDoc(doc(db, "adminUsers", uid), {
        name: name.trim(), email: email.trim(), role, isActive: true,
        createdBy: currentUser?.uid ?? "", createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setShowModal(false);
      void loadUsers();
    } catch (err: unknown) {
      const msg = (err as Error).message ?? "";
      if (msg.includes("EMAIL_EXISTS")) setFormError("Este correo ya está registrado.");
      else if (msg.includes("WEAK_PASSWORD")) setFormError("La contraseña es demasiado débil.");
      else setFormError(msg || "No se pudo crear el usuario.");
    } finally { setFormLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openModal}><UserPlus size={14} />Nuevo Administrador</Button>
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        {loadingList ? (
          <div className="flex justify-center py-16"><span className="inline-block w-5 h-5 border-2 border-vous-border border-t-vous-gold rounded-full animate-spin" /></div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center"><p className="text-sm text-vous-text-secondary font-nav">No hay usuarios administrativos registrados.</p></div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-white/30">
              {users.map((u) => (
                <div key={u.uid} className="p-4 hover:bg-amber-50/30 transition-colors space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/90 border border-vous-border flex items-center justify-center text-[11px] font-nav text-vous-text-secondary uppercase shrink-0">{u.name.charAt(0)}</div>
                    <div>
                      <p className="font-sans text-vous-text font-medium">{u.name}{u.uid === currentUser?.uid && <span className="ml-1.5 text-[10px] text-vous-gold font-nav">(tú)</span>}</p>
                      <p className="text-[11px] text-vous-text-secondary font-sans">{u.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Rol</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-nav uppercase tracking-wider border ${u.role === "superadmin" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                        {u.role === "superadmin" ? <ShieldCheck size={10} /> : <Shield size={10} />}{u.role === "superadmin" ? "Superadmin" : "Admin"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-nav uppercase text-vous-text-secondary">Estado</p>
                      <Badge variant={u.isActive ? "active" : "inactive"}>{u.isActive ? "Activo" : "Inactivo"}</Badge>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-white/30">
                    <button onClick={() => toggleActive(u.uid, u.isActive)} disabled={u.uid === currentUser?.uid} title={u.uid === currentUser?.uid ? "No puedes desactivar tu propia cuenta" : u.isActive ? "Desactivar" : "Activar"} className="text-vous-text-secondary hover:text-vous-text disabled:opacity-30 transition-colors">
                      {u.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Nombre", "Correo", "Rol", "Estado", "Acciones"].map((h) => <TableHead key={h}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.uid}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-white/90 border border-vous-border flex items-center justify-center text-[10px] font-nav text-vous-text-secondary uppercase">{u.name.charAt(0)}</div>
                          <span className="font-sans text-vous-text">{u.name}{u.uid === currentUser?.uid && <span className="ml-1.5 text-[10px] text-vous-gold font-nav">(tú)</span>}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-vous-text-secondary font-sans">{u.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-nav uppercase tracking-wider border ${u.role === "superadmin" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-sky-50 text-sky-700 border-sky-200"}`}>
                          {u.role === "superadmin" ? <ShieldCheck size={10} /> : <Shield size={10} />}{u.role === "superadmin" ? "Superadmin" : "Admin"}
                        </span>
                      </TableCell>
                      <TableCell><Badge variant={u.isActive ? "active" : "inactive"}>{u.isActive ? "Activo" : "Inactivo"}</Badge></TableCell>
                      <TableCell>
                        <button onClick={() => toggleActive(u.uid, u.isActive)} disabled={u.uid === currentUser?.uid} title={u.uid === currentUser?.uid ? "No puedes desactivar tu propia cuenta" : u.isActive ? "Desactivar" : "Activar"} className="text-vous-text-secondary hover:text-vous-text disabled:opacity-30 transition-colors">
                          {u.isActive ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} />}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Administrador</DialogTitle>
            <DialogDescription>El usuario podrá acceder al panel inmediatamente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">Nombre Completo</label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="María García" />
            </div>
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">Correo Electrónico</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@vous.com" />
            </div>
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">Contraseña Temporal</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vous-text-secondary hover:text-vous-text transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <p className="text-[10px] text-vous-text-muted font-sans mt-1">Comparte esta contraseña con el usuario para que ingrese.</p>
            </div>
            <div>
              <label className="block text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary mb-1.5">Rol</label>
              <div className="flex gap-3">
                {(["admin", "superadmin"] as AdminRole[]).map((r) => (
                  <Button key={r} type="button" variant={role === r ? "default" : "outline"} className="flex-1" onClick={() => setRole(r)}>
                    {r === "superadmin" ? <ShieldCheck size={12} /> : <Shield size={12} />}{r === "superadmin" ? "Superadmin" : "Admin"}
                  </Button>
                ))}
              </div>
            </div>
            {formError && <div className="border border-red-200 bg-red-50 px-3 py-2"><p className="text-xs text-red-700 font-sans">{formError}</p></div>}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" disabled={formLoading} className="flex-1">{formLoading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={13} />}{formLoading ? "Creando..." : "Crear Usuario"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
