"use client";

import { useRef } from "react";
import {
  Upload,
  CheckCircle,
  QrCode,
  Loader2,
  AlertCircle,
  Building2,
  User,
  CreditCard,
  Info,
} from "lucide-react";
import type { PaymentConfig } from "@/domain/entities/payment-config.entity";

interface CheckoutPaymentStepProps {
  orderNumber: string;
  subtotal: number;
  loadingQR: boolean;
  paymentConfig: PaymentConfig | null;
  proofFile: File | null;
  proofError: string | null;
  uploading: boolean;
  onFileChange: (file: File | null) => void;
  onSubmitProof: () => void;
}

export function CheckoutPaymentStep({
  orderNumber,
  subtotal,
  loadingQR,
  paymentConfig,
  proofFile,
  proofError,
  uploading,
  onFileChange,
  onSubmitProof,
}: CheckoutPaymentStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section>
      <div className="mb-6 p-3 bg-white border border-black/10 font-sans text-sm text-black">
        Pedido <strong>{orderNumber}</strong> creado. Realiza la transferencia y sube tu
        comprobante.
      </div>

      <h2 className="font-nav text-[11px] font-semibold tracking-[0.25em] uppercase text-black mb-6">
        Pago mediante QR — E-Transfer
      </h2>

      <div className="flex flex-col gap-8">
        {/* QR image — centered, enorme */}
        <div className="flex justify-center">
          {loadingQR ? (
            <div className="w-80 h-80 md:w-96 md:h-96 bg-white border border-black/10 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-black/50" />
            </div>
          ) : paymentConfig?.qrImageUrl ? (
            <img
              src={paymentConfig.qrImageUrl}
              alt="Código QR para pago"
              className="w-80 h-80 md:w-96 md:h-96 object-contain border border-black/10"
            />
          ) : (
            <div className="w-80 h-80 md:w-96 md:h-96 bg-white border border-black/10 flex flex-col items-center justify-center gap-3 text-black/50">
              <QrCode size={56} strokeWidth={1} />
              <span className="font-sans text-sm text-center px-2">QR no disponible</span>
            </div>
          )}
        </div>

        {/* Bank details + instructions + upload */}
        <div className="space-y-4">
          {/* Bank details */}
          {paymentConfig &&
            (paymentConfig.bankName ||
              paymentConfig.accountHolder ||
              paymentConfig.accountNumber) && (
              <div className="bg-white border border-black/10 p-4 space-y-2">
                {paymentConfig.bankName && (
                  <div className="flex items-center gap-2 font-sans text-sm text-black">
                    <Building2 size={15} strokeWidth={1.5} className="text-black shrink-0" />
                    <span>{paymentConfig.bankName}</span>
                  </div>
                )}
                {paymentConfig.accountHolder && (
                  <div className="flex items-center gap-2 font-sans text-sm text-black">
                    <User size={15} strokeWidth={1.5} className="text-black shrink-0" />
                    <span>{paymentConfig.accountHolder}</span>
                  </div>
                )}
                {paymentConfig.accountNumber && (
                  <div className="flex items-center gap-2 font-sans text-sm text-black">
                    <CreditCard size={15} strokeWidth={1.5} className="text-black shrink-0" />
                    <span className="font-mono tracking-wide">{paymentConfig.accountNumber}</span>
                  </div>
                )}
              </div>
            )}

          {/* Instructions */}
          {paymentConfig?.instructions && (
            <div className="flex items-start gap-2 font-sans text-xs text-black/50 bg-white/50 p-3 border border-black/10">
              <Info size={14} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
              <span className="leading-relaxed">{paymentConfig.instructions}</span>
            </div>
          )}

          <p className="font-sans text-sm text-black/50 leading-relaxed">
            Escanea el código QR desde tu aplicación bancaria y realiza la transferencia por el
            monto total. Una vez completado, adjunta tu comprobante de pago.
          </p>

          <p className="font-sans text-sm text-black font-medium">
            Total a transferir:{" "}
            <span className="font-serif text-lg">Bs. {subtotal.toLocaleString("es-BO")}</span>
          </p>

          <div
            className="border-2 border-dashed border-black/10 hover:border-black transition-colors cursor-pointer p-6 text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            {proofFile ? (
              <div className="flex items-center justify-center gap-2 text-black">
                <CheckCircle size={16} />
                <span className="font-sans text-sm truncate max-w-[220px]">{proofFile.name}</span>
              </div>
            ) : (
              <>
                <Upload size={18} className="mx-auto text-black/50 mb-2" />
                <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-black/50">
                  Subir comprobante de pago
                </p>
                <p className="font-sans text-xs text-black/20 mt-1">
                  JPG, PNG o PDF (máx. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />

          {proofError && (
            <div className="flex items-center gap-2 text-red-600 font-sans text-sm">
              <AlertCircle size={14} />
              {proofError}
            </div>
          )}

          <button
            onClick={onSubmitProof}
            disabled={uploading || !proofFile}
            className="w-full font-nav text-[12px] font-semibold tracking-[0.15em] uppercase bg-black text-white py-4 hover:bg-black/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Subiendo comprobante…
              </>
            ) : (
              "Confirmar pago y finalizar pedido"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
