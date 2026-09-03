import type { PaymentConfigRepository } from "@/domain/repositories/payment-config.repository";
import type { UpdatePaymentConfigInput } from "@/domain/entities/payment-config.entity";

export async function updatePaymentConfig(
  repo: PaymentConfigRepository,
  input: UpdatePaymentConfigInput
): Promise<void> {
  return repo.update(input);
}
