import type { WholesaleRulesRepository } from "@/domain/repositories/wholesale-rules.repository";
import type { WholesaleRules } from "@/domain/entities/wholesale-rules.entity";

export interface ValidateWholesaleCheckoutInput {
  subtotal: number;
  unitCount: number;
  userRole: "wholesale" | "customer";
}

export interface ValidateWholesaleCheckoutResult {
  allowed: boolean;
  rules?: WholesaleRules;
  errors: string[];
}

/**
 * Validates whether a wholesale checkout meets the configured commercial rules.
 * Returns the applicable rules and any blocking errors.
 */
export async function validateWholesaleCheckout(
  repo: WholesaleRulesRepository,
  input: ValidateWholesaleCheckoutInput
): Promise<ValidateWholesaleCheckoutResult> {
  if (input.userRole !== "wholesale") {
    return { allowed: true, errors: [] };
  }

  const rules = await repo.get();

  if (!rules.isActive) {
    return { allowed: true, rules, errors: [] };
  }

  const errors: string[] = [];

  if (input.subtotal < rules.minimumPurchaseAmount) {
    errors.push(`El monto mínimo de compra para mayoristas es Bs. ${rules.minimumPurchaseAmount}`);
  }

  if (input.unitCount < rules.minimumPurchaseUnits) {
    errors.push(
      `La cantidad mínima de unidades para pedidos mayoristas es ${rules.minimumPurchaseUnits}`
    );
  }

  return {
    allowed: errors.length === 0,
    rules,
    errors,
  };
}
