import type { PaymentConfigRepository } from "@/domain/repositories/payment-config.repository";
import type { PaymentConfig } from "@/domain/entities/payment-config.entity";

export async function getPaymentConfig(repo: PaymentConfigRepository): Promise<PaymentConfig | null> {
  return repo.get();
}
