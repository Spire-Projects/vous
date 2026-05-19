"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, CheckCircle, Pencil, X, Check, Loader2, PackageSearch } from "lucide-react";
import { AccountSidebar } from "@/components/cuenta/AccountSidebar";
import { OrderCard } from "@/components/cuenta/OrderCard";
import { OrderDetailModal } from "@/components/cuenta/OrderDetailModal";
import { useAuthContext } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/domain/entities/order.entity";

type TabId = "perfil" | "pedidos" | "mayorista" | "direcciones";

const DEPARTAMENTOS = [
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Tarija",
  "Beni",
  "Pando",
];

function TabPerfil() {
  const { user, userProfile, updateProfile } = useAuthContext();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const displayName = userProfile?.name ?? user?.displayName ?? "";
  const firstName = displayName.split(" ")[0] || user?.email?.split("@")[0] || "usuario";

  function startEditing() {
    setName(userProfile?.name ?? user?.displayName ?? "");
    setPhone(userProfile?.phone ?? "");
    setDepartamento(userProfile?.departamento ?? "");
    setBirthDate(userProfile?.birthDate ?? "");
    setSaveError("");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setSaveError("");
  }

  async function handleSave() {
    setSaveError("");
    setSaving(true);
    try {
      await updateProfile({
        ...(name.trim() && { name: name.trim() }),
        phone: phone.trim() || null,
        departamento: departamento || null,
        birthDate: birthDate || null,
      });
      setEditing(false);
    } catch {
      setSaveError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border-b border-vous-gray-light focus:border-vous-gold outline-none py-1.5 font-sans text-sm text-vous-soft-black transition-colors duration-200";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-vous-soft-black mb-1">Datos Personales</h2>
          <p className="font-sans text-sm text-vous-gray">
            Bienvenido de nuevo, {firstName}. Gestiona tus pedidos y preferencias.
          </p>
        </div>
        {!editing && (
          <button
            onClick={startEditing}
            className="shrink-0 flex items-center gap-1.5 font-nav text-[10px] font-semibold tracking-[0.15em] uppercase text-vous-gray hover:text-vous-gold transition-colors"
          >
            <Pencil size={13} />
            Editar
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Tu nombre completo"
            />
          </div>

          {/* Email (solo lectura) */}
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              Email
            </label>
            <p className="font-sans text-sm text-vous-gray py-1.5 border-b border-vous-gray-light/40">
              {userProfile?.email ?? user?.email ?? "—"}
            </p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+591 7xxxxxxx"
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              Departamento
            </label>
            <div className="relative">
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className={`${inputClass} appearance-none pr-6`}
              >
                <option value="">Selecciona tu departamento</option>
                {DEPARTAMENTOS.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-vous-gray">
                <svg width="11" height="6" viewBox="0 0 12 7" fill="none">
                  <path
                    d="M1 1l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {saveError && <p className="font-sans text-[13px] text-red-600">{saveError}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white px-6 py-2.5 hover:bg-vous-gold-dark disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-gray-light text-vous-gray px-6 py-2.5 hover:border-vous-soft-black hover:text-vous-soft-black transition-colors"
            >
              <X size={13} />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Nombre", value: userProfile?.name ?? user?.displayName ?? "—" },
              { label: "Email", value: userProfile?.email ?? user?.email ?? "—" },
              { label: "Teléfono", value: userProfile?.phone ?? "—" },
              { label: "Departamento", value: userProfile?.departamento ?? "—" },
              ...(userProfile?.birthDate
                ? [{ label: "Nacimiento", value: userProfile.birthDate }]
                : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1">
                  {label}
                </p>
                <p className="font-sans text-sm text-vous-soft-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={startEditing}
              className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors"
            >
              Editar Perfil
            </button>
            <div className="flex items-center gap-2 font-sans text-xs text-vous-gold border border-vous-gold/30 px-3 py-2">
              <Star size={12} />
              Programa de Exclusividad
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TabMayorista() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-vous-soft-black mb-1">Solicitud Mayorista</h2>
      </div>
      <div className="border border-vous-gray-light/40 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-nav text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-vous-gold/10 text-vous-gold">
            En Revisión
          </span>
          <p className="font-sans text-xs text-vous-gray">Actualizado hace 2 días</p>
        </div>
        <h3 className="font-serif text-lg text-vous-soft-black">Beneficios VIP Activados</h3>
        <ul className="space-y-2">
          {["Precios de Curaduría", "Acceso Early-Release", "Soporte Personalizado"].map((b) => (
            <li key={b} className="flex items-center gap-2 font-sans text-sm text-vous-gray">
              <CheckCircle size={14} className="text-vous-gold shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabPedidos({ userId }: { userId: string }) {
  const { orders, loading, error } = useOrders(userId);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-vous-gray">
        <Loader2 size={22} className="animate-spin" />
        <p className="font-sans text-sm">Cargando pedidos…</p>
      </div>
    );
  }

  if (error) {
    return <p className="font-sans text-sm text-red-600 py-8">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-vous-soft-black">Mis Pedidos</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-vous-gray border border-vous-gray-light/40">
          <PackageSearch size={36} strokeWidth={1} />
          <div className="text-center">
            <p className="font-sans text-sm">Todavía no tienes pedidos.</p>
            <p className="font-sans text-xs mt-1">
              Cuando realices tu primera compra aparecerá aquí.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onViewDetail={setSelectedOrder} />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function TabDirecciones() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-vous-soft-black">Direcciones</h2>
      <p className="font-sans text-sm text-vous-gray">No tienes direcciones guardadas.</p>
      <button className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-vous-soft-black text-vous-soft-black px-6 py-2.5 hover:bg-vous-soft-black hover:text-white transition-colors">
        Agregar Dirección
      </button>
    </div>
  );
}

export default function CuentaPage() {
  const { user, loading, signOut } = useAuthContext();
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("perfil");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <AccountSidebar
            active={tab}
            onTab={(id) => setTab(id as TabId)}
            onLogout={handleLogout}
          />
          <main className="flex-1 min-w-0">
            {tab === "perfil" && <TabPerfil />}
            {tab === "pedidos" && <TabPedidos userId={user.uid} />}
            {tab === "mayorista" && <TabMayorista />}
            {tab === "direcciones" && <TabDirecciones />}
          </main>
        </div>
      </div>
    </div>
  );
}
