import type { WholesaleRulesRepository } from "@/domain/repositories/wholesale-rules.repository";
import type { UpdateWholesaleRulesInput } from "@/domain/entities/wholesale-rules.entity";

export async function updateWholesaleRules(
  repo: WholesaleRulesRepository,
  input: UpdateWholesaleRulesInput
): Promise<void> {
  return repo.update(input);
}
