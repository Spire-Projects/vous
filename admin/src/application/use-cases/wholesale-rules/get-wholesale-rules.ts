import type { WholesaleRulesRepository } from "@/domain/repositories/wholesale-rules.repository";
import type { WholesaleRules } from "@/domain/entities/wholesale-rules.entity";

export async function getWholesaleRules(repo: WholesaleRulesRepository): Promise<WholesaleRules> {
  return repo.get();
}
