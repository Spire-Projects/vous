import { Loader2, QrCode } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/shared/ImagePicker";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";

export function PaymentTab({ paymentConfig }: { paymentConfig: ReturnType<typeof usePaymentConfig> }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Configuración de Pagos</h2>
      <p className="font-sans text-sm text-vous-text-secondary">
        Configura el QR y los datos bancarios que los clientes verán al realizar un pedido.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>Nombre del Banco</Label>
          <Input
            value={paymentConfig.config?.bankName ?? ""}
            onChange={(e) => paymentConfig.update({ bankName: e.target.value })}
            placeholder="Banco Mercantil Santa Cruz"
          />
        </div>
        <div className="space-y-1">
          <Label>Titular de la cuenta</Label>
          <Input
            value={paymentConfig.config?.accountHolder ?? ""}
            onChange={(e) => paymentConfig.update({ accountHolder: e.target.value })}
            placeholder="VOUS S.R.L."
          />
        </div>
        <div className="space-y-1">
          <Label>Número de cuenta</Label>
          <Input
            value={paymentConfig.config?.accountNumber ?? ""}
            onChange={(e) => paymentConfig.update({ accountNumber: e.target.value })}
            placeholder="1234567890"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Instrucciones de pago</Label>
        <Textarea
          value={paymentConfig.config?.instructions ?? ""}
          onChange={(e) => paymentConfig.update({ instructions: e.target.value })}
          placeholder="Realizar la transferencia por el monto exacto y subir el comprobante. El pedido se confirma al verificar el pago."
          rows={3}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="space-y-1 w-full sm:w-80">
          <Label className="flex items-center gap-1.5">
            <QrCode size={13} /> Imagen del QR activo
          </Label>
          <ImagePicker
            value={paymentConfig.config?.qrImageUrl ?? ""}
            onChange={async (url) => {
              await paymentConfig.update({ qrImageUrl: url });
            }}
            folder="vous/qr"
            label="Subir QR"
            aspect="square"
          />
        </div>
        {paymentConfig.config?.qrImageUrl && (
          <div className="flex flex-col gap-2">
            <span className="font-nav text-[10px] uppercase tracking-wide text-vous-text-secondary">QR actual</span>
            <img src={paymentConfig.config.qrImageUrl} alt="QR de pago activo" className="w-36 h-36 object-contain border border-vous-border" />
          </div>
        )}
      </div>
      {paymentConfig.saving && (
        <div className="flex items-center gap-2 text-vous-text-secondary font-sans text-xs">
          <Loader2 size={12} className="animate-spin" /> Guardando configuración de pagos…
        </div>
      )}
    </div>
  );
}
