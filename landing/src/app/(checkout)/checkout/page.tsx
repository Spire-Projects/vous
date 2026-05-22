"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import { useCheckout } from "@/hooks/useCheckout";
import {
  CheckoutFormStep,
  CheckoutPaymentStep,
  CheckoutSuccessStep,
  CheckoutOrderSummary,
} from "@/components/checkout";

export default function CheckoutPage() {
  const { config: paymentConfig, loading: loadingQR } = usePaymentConfig();
  const {
    step,
    items,
    subtotal,
    form,
    setForm,
    formError,
    stockErrors,
    creatingOrder,
    orderNumber,
    proofFile,
    setProofFile,
    proofError,
    uploading,
    discountCode,
    setDiscountCode,
    discountAmount,
    discountError,
    wholesaleErrors,
    finalTotal,
    handleProceedToPayment,
    handleSubmitProof,
    handleApplyDiscount,
  } = useCheckout();

  if (step === "success") return <CheckoutSuccessStep orderNumber={orderNumber} />;

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="border-b border-vous-gray-light/40 py-4 px-5 md:px-20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-[0.08em] text-vous-soft-black"
          >
            VOUS
          </Link>
          <div className="flex items-center gap-2 font-sans text-xs text-vous-gray">
            <Shield size={13} className="text-vous-gold" />
            Pago Seguro
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-vous-soft-black mb-12">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="flex-1 min-w-0 space-y-10">
            {step === "form" && (
              <CheckoutFormStep
                form={form}
                onFieldChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
                formError={formError}
                submitting={creatingOrder}
                onSubmit={handleProceedToPayment}
                stockErrors={stockErrors}
                wholesaleErrors={wholesaleErrors}
              />
            )}
            {step === "payment" && (
              <CheckoutPaymentStep
                orderNumber={orderNumber}
                subtotal={finalTotal}
                loadingQR={loadingQR}
                paymentConfig={paymentConfig}
                proofFile={proofFile}
                proofError={proofError}
                uploading={uploading}
                onFileChange={setProofFile}
                onSubmitProof={handleSubmitProof}
              />
            )}
          </div>
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
            discountCode={discountCode}
            onDiscountCodeChange={setDiscountCode}
            discountAmount={discountAmount}
            discountError={discountError}
            onApplyDiscount={handleApplyDiscount}
            wholesaleErrors={wholesaleErrors}
            finalTotal={finalTotal}
          />
        </div>
      </div>
    </div>
  );
}
