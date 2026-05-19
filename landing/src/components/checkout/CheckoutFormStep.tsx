"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import type { OutOfStockItem } from "@/application/use-cases/order/validate-stock";

export interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
}

interface CheckoutFormStepProps {
  form: ShippingForm;
  onFieldChange: (key: keyof ShippingForm, value: string) => void;
  formError: string | null;
  submitting: boolean;
  onSubmit: () => void;
  stockErrors: OutOfStockItem[];
}

const FIELDS = [
  { key: "fullName", label: "Nombre Completo", type: "text", span: true },
  { key: "email", label: "Correo Electrónico", type: "email", span: false },
  { key: "phone", label: "Celular", type: "tel", span: false },
  { key: "department", label: "Departamento", type: "text", span: false },
  { key: "city", label: "Ciudad", type: "text", span: false },
  { key: "address", label: "Dirección de entrega", type: "text", span: true },
] as const;

export function CheckoutFormStep({
  form,
  onFieldChange,
  formError,
  submitting,
  onSubmit,
  stockErrors,
}: CheckoutFormStepProps) {
  return (
    <section>
      <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-vous-gold mb-6">
        Información de Envío
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, type, span }) => (
          <div key={key} className={span ? "md:col-span-2" : ""}>
            <label className="block font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1.5">
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => onFieldChange(key, e.target.value)}
              className="w-full border border-vous-gray-light bg-transparent font-sans text-sm text-vous-soft-black px-3 py-2.5 outline-none focus:border-vous-gold transition-colors"
            />
          </div>
        ))}
      </div>

      {stockErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200">
          <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-red-600 mb-2">
            Ítems sin stock suficiente
          </p>
          <ul className="space-y-1">
            {stockErrors.map((e) => (
              <li key={e.productId} className="font-sans text-sm text-red-600">
                <strong>{e.productName}</strong> — solicitado: {e.requested}, disponible:{" "}
                {e.available}
              </li>
            ))}
          </ul>
        </div>
      )}

      {formError && (
        <div className="mt-4 flex items-center gap-2 text-red-600 font-sans text-sm">
          <AlertCircle size={14} />
          {formError}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="mt-6 w-full font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-vous-soft-black text-white py-4 hover:bg-vous-gray-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Verificando stock…
          </>
        ) : (
          "Continuar al pago"
        )}
      </button>
    </section>
  );
}
