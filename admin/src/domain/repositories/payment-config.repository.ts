import type { PaymentConfig, UpdatePaymentConfigInput } from "@/domain/entities/payment-config.entity";

export interface PaymentConfigRepository {
  get(): Promise<PaymentConfig | null>;
  update(input: UpdatePaymentConfigInput): Promise<void>;
}
