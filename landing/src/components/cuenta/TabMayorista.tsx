"use client";

import { CheckCircle } from "lucide-react";

export function TabMayorista() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-black mb-1">Solicitud Mayorista</h2>
      </div>
      <div className="border border-black/10 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-nav text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-black/10 text-black">
            En Revisión
          </span>
          <p className="font-sans text-xs text-black/50">Actualizado hace 2 días</p>
        </div>
        <h3 className="font-serif text-lg text-black">Beneficios VIP Activados</h3>
        <ul className="space-y-2">
          {["Precios de Curaduría", "Acceso Early-Release", "Soporte Personalizado"].map((b) => (
            <li key={b} className="flex items-center gap-2 font-sans text-sm text-black/50">
              <CheckCircle size={14} className="text-black shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
