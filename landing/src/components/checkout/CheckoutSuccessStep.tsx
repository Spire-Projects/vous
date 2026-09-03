import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface CheckoutSuccessStepProps {
  orderNumber: string;
}

export function CheckoutSuccessStep({ orderNumber }: CheckoutSuccessStepProps) {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <CheckCircle size={48} className="text-green-600 mb-4" />
      <h1 className="font-serif text-3xl text-black mb-3">¡Pedido recibido!</h1>
      <p className="font-sans text-sm text-black/50 max-w-sm mb-2">
        Tu pedido <strong>{orderNumber}</strong> fue registrado con éxito. Estamos verificando tu
        pago y te notificaremos cuando sea confirmado.
      </p>
      <p className="font-sans text-xs text-black/50 max-w-sm mb-8">
        Si tienes dudas, escríbenos por WhatsApp.
      </p>
      <div className="flex gap-4">
        <Link
          href="/cuenta"
          className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase border border-black text-black px-8 py-3 hover:bg-black hover:text-white transition-colors"
        >
          Ver mis pedidos
        </Link>
        <Link
          href="/"
          className="font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-black text-white px-8 py-3 hover:bg-black/80 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
