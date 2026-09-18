import { Building2, User, CreditCard, Info } from "lucide-react";
import type { PaymentConfig } from "@/domain/entities/payment-config.entity";

interface PaymentBankDetailsProps {
  paymentConfig: PaymentConfig;
}

export function PaymentBankDetails({ paymentConfig }: PaymentBankDetailsProps) {
  const hasDetails =
    paymentConfig.bankName || paymentConfig.accountHolder || paymentConfig.accountNumber;

  return (
    <>
      {hasDetails && (
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

      {paymentConfig.instructions && (
        <div className="flex items-start gap-2 font-sans text-xs text-black/50 bg-white/50 p-3 border border-black/10">
          <Info size={14} strokeWidth={1.5} className="text-black shrink-0 mt-0.5" />
          <span className="leading-relaxed">{paymentConfig.instructions}</span>
        </div>
      )}
    </>
  );
}
