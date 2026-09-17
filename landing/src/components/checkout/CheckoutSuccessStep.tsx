import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutSuccessStepProps {
  orderNumber: string;
}

export function CheckoutSuccessStep({ orderNumber }: CheckoutSuccessStepProps) {
  return (
    <div className="bg-vous-warm-white min-h-screen flex flex-col items-center justify-center px-5 py-12 text-center">
      <CheckCircle size={48} className="text-green-600 mb-4" />
      <h1 className="font-serif text-3xl text-black mb-3">¡Pedido recibido!</h1>
      <p className="font-sans text-sm text-black/50 max-w-sm mb-2">
        Tu pedido <strong>{orderNumber}</strong> fue registrado con éxito. Estamos verificando tu
        pago y te notificaremos cuando sea confirmado.
      </p>
      <p className="font-sans text-xs text-black/50 max-w-sm mb-8">
        Si tienes dudas, escríbenos por WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center">
        <Button asChild variant="outline" size="default">
          <Link href="/cuenta">Ver mis pedidos</Link>
        </Button>
        <Button asChild variant="default" size="default">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
