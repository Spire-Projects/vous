import type { PaymentConfig } from "@/domain/entities/payment-config.entity";

export interface PaymentConfigRepository {
  get(): Promise<PaymentConfig | null>;
}
