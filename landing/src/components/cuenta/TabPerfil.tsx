"use client";

import { useState } from "react";
import { Pencil, X, Check, Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

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

export function TabPerfil() {
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
    "w-full bg-transparent border-b border-black/10 focus:border-black outline-none py-1.5 font-sans text-sm text-black transition-colors duration-200";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-black mb-1">Datos Personales</h2>
          <p className="font-sans text-sm text-black/50">
            Bienvenido de nuevo, {firstName}. Gestiona tus pedidos y preferencias.
          </p>
        </div>
        {!editing && (
          <button
            onClick={startEditing}
            className="shrink-0 flex items-center gap-1.5 font-nav text-[10px] font-semibold tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors"
          >
            <Pencil size={13} /> Editar
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-6">
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
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
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
              Email
            </label>
            <p className="font-sans text-sm text-black/50 py-1.5 border-b border-black/10">
              {userProfile?.email ?? user?.email ?? "—"}
            </p>
          </div>
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
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
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
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
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-black/50">
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
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
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
              className="flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-black text-white px-6 py-2.5 hover:bg-black/80 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-black/10 text-black/50 px-6 py-2.5 hover:border-black hover:text-black transition-colors"
            >
              <X size={13} /> Cancelar
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
                <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1">
                  {label}
                </p>
                <p className="font-sans text-sm text-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={startEditing}
              className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-black text-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors"
            >
              Editar Perfil
            </button>
          </div>
        </>
      )}
    </div>
  );
}
