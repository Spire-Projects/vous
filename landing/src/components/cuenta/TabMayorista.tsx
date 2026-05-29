"use client";

import { CheckCircle } from "lucide-react";

export function TabMayorista() {
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
