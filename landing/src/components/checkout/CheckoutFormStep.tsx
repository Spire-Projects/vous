"use client";

import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  onOpenStockDialog?: () => void;
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
  onOpenStockDialog,
}: CheckoutFormStepProps) {
  return (
    <section>
      <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-vous-gold mb-6">
        Información de Envío
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, type, span }) => (
          <div key={key} className={span ? "md:col-span-2" : ""}>
            <Label htmlFor={key} className="mb-1.5">
              {label}
            </Label>
            <Input
              id={key}
              type={type}
              value={form[key]}
              onChange={(e) => onFieldChange(key, e.target.value)}
              placeholder={`Ingresa tu ${label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      {stockErrors.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50/80 border border-amber-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-800 font-serif text-sm">
              <AlertTriangle size={16} className="shrink-0 text-amber-700" />
              <span>
                Stock insuficiente en {stockErrors.length}{" "}
                {stockErrors.length === 1 ? "producto" : "productos"}
              </span>
            </div>
            {onOpenStockDialog && (
              <button
                type="button"
                onClick={onOpenStockDialog}
                className="font-nav text-[10px] tracking-[0.15em] uppercase font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
              >
                Resolver
              </button>
            )}
          </div>
          <ul className="mt-2.5 space-y-1.5 divide-y divide-amber-200/60 pt-1">
            {stockErrors.map((e) => (
              <li
                key={e.id}
                className="pt-1.5 flex items-center justify-between text-xs font-sans text-amber-900"
              >
                <span className="truncate pr-2 font-medium">{e.productName}</span>
                <Badge variant={e.available <= 0 ? "out_of_stock" : "warning"}>
                  {e.available <= 0 ? "Agotado" : `${e.available} disp.`}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formError && (
        <div className="mt-4 flex items-center gap-2 text-red-600 font-sans text-sm">
          <AlertCircle size={14} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <Button
        type="button"
        variant="default"
        size="lg"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-6 w-full justify-center"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Verificando stock…
          </>
        ) : (
          "Continuar al pago"
        )}
      </Button>
    </section>
  );
}
