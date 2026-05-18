import Link from "next/link";
import { Lock, Truck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: string;
  total: string;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  return (
    <div className="lg:w-80 shrink-0">
      <div className="bg-vous-cream p-6 sticky top-24">
        <h2 className="font-serif text-xl text-vous-soft-black mb-6">Resumen</h2>

        <div className="space-y-3 mb-6 font-sans text-sm">
          <div className="flex justify-between text-vous-gray">
            <span>Subtotal</span>
            <span className="text-vous-soft-black font-medium">{subtotal}</span>
          </div>
          <div className="flex justify-between text-vous-gray">
            <span>Envío</span>
            <span className="italic">Calculado en el checkout</span>
          </div>
          <div className="flex justify-between text-vous-gray">
            <span>Impuestos</span>
            <span>Bs. 0,00</span>
          </div>
          <div className="flex justify-between border-t border-vous-gray-light/40 pt-3 text-vous-soft-black font-medium">
            <span className="font-nav tracking-[0.1em] uppercase text-sm">Total</span>
            <span className="font-serif text-lg">{total}</span>
          </div>
        </div>

        <Button asChild variant="default" size="lg" className="w-full">
          <Link href="/checkout">Finalizar Compra</Link>
        </Button>

        <div className="mt-5 space-y-2">
          {[
            { icon: Lock, text: "Pago 100% Seguro" },
            { icon: Truck, text: "Envío Express Disponible" },
            { icon: RefreshCcw, text: "Devoluciones en 14 días" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 font-sans text-[11px] text-vous-gray"
            >
              <Icon size={12} className="shrink-0 text-vous-gold" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
