"use client";

import { useState } from "react";
import { Pencil, X, Check, Loader2, MapPin, Plus, Home, Building2, Trash2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import type { UserAddress } from "@/types/auth.types";

export function TabDirecciones() {
  const { userProfile, updateAddresses } = useAuthContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [label, setLabel] = useState("");
  const [addrField, setAddrField] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [mapsLink, setMapsLink] = useState("");

  const addresses = userProfile?.addresses ?? [];

  function startNew() {
    setEditingId("new");
    setLabel("");
    setAddrField("");
    setCity("");
    setDetails("");
    setMapsLink("");
  }

  function startEdit(addr: UserAddress) {
    setEditingId(addr.id);
    setLabel(addr.label);
    setAddrField(addr.address);
    setCity(addr.city);
    setDetails(addr.details ?? "");
    setMapsLink(addr.mapsLink ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSave() {
    if (!addrField.trim() || !city.trim()) return;
    setSaving(true);
    try {
      if (editingId === "new") {
        const newAddr: UserAddress = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2),
          label: label.trim() || "Casa",
          address: addrField.trim(),
          city: city.trim(),
          details: details.trim() || undefined,
          mapsLink: mapsLink.trim() || undefined,
        };
        await updateAddresses([...addresses, newAddr]);
      } else {
        await updateAddresses(
          addresses.map((a) =>
            a.id === editingId
              ? {
                  ...a,
                  label: label.trim() || a.label,
                  address: addrField.trim(),
                  city: city.trim(),
                  details: details.trim() || undefined,
                  mapsLink: mapsLink.trim() || undefined,
                }
              : a
          )
        );
      }
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await updateAddresses(addresses.filter((a) => a.id !== id));
  }

  const inputClass =
    "w-full bg-transparent border-b border-black/10 focus:border-black outline-none py-1.5 font-sans text-sm text-black transition-colors duration-200";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-black mb-1">Direcciones</h2>
          <p className="font-sans text-sm text-black/50">
            {addresses.length > 0
              ? `${addresses.length} dirección${addresses.length > 1 ? "es" : ""} guardada${addresses.length > 1 ? "s" : ""}.`
              : "Agrega tus direcciones de envío para agilizar tus pedidos."}
          </p>
        </div>
        {!editingId && (
          <button
            onClick={startNew}
            className="shrink-0 flex items-center gap-1.5 font-nav text-[10px] font-semibold tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors"
          >
            <Plus size={14} /> Nueva
          </button>
        )}
      </div>

      {addresses.length > 0 && !editingId && (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="border border-black/10 p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {a.label.toLowerCase().includes("oficina") ? (
                    <Building2 size={14} className="text-black shrink-0" />
                  ) : (
                    <Home size={14} className="text-black shrink-0" />
                  )}
                  <span className="font-nav text-[10px] tracking-[0.15em] uppercase text-black">
                    {a.label}
                  </span>
                </div>
                <p className="font-sans text-sm text-black">{a.address}</p>
                <p className="font-sans text-xs text-black/50">
                  {a.city}
                  {a.details ? ` · ${a.details}` : ""}
                </p>
                {a.mapsLink && (
                  <a
                    href={a.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 font-sans text-[11px] text-black hover:underline"
                  >
                    Ver en Maps ↗
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(a)}
                  className="p-1.5 text-black/50 hover:text-black transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 text-black/50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className="space-y-6 border border-black/10 p-6">
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
              Etiqueta
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {["Casa", "Oficina", "Departamento"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`px-3 py-1 text-xs font-sans border transition-colors ${label === l ? "bg-black text-white border-black" : "border-black/10 text-black/50 hover:border-black"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={inputClass}
              placeholder="O escribe una etiqueta personalizada"
            />
          </div>
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
              Dirección *
            </label>
            <input
              type="text"
              value={addrField}
              onChange={(e) => setAddrField(e.target.value)}
              className={inputClass}
              placeholder="Calle y número"
            />
          </div>
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
              Ciudad *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              placeholder="Cochabamba"
            />
          </div>
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
              Referencia
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={inputClass}
              placeholder="Zona, color de casa, timbre..."
            />
          </div>
          <div>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-1.5">
              Link de Google Maps
            </label>
            <input
              type="text"
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              className={inputClass}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !addrField.trim() || !city.trim()}
              className="flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-black text-white px-6 py-2.5 hover:bg-black/80 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-black/10 text-black/50 px-6 py-2.5 hover:border-black hover:text-black transition-colors"
            >
              <X size={13} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {!editingId && addresses.length === 0 && (
        <div className="border border-black/10 p-8 text-center">
          <MapPin size={32} strokeWidth={1} className="text-black mx-auto mb-3" />
          <p className="font-sans text-sm text-black/50">No tienes direcciones guardadas.</p>
          <button
            onClick={startNew}
            className="mt-3 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border border-black text-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors"
          >
            Agregar Dirección
          </button>
        </div>
      )}
    </div>
  );
}
