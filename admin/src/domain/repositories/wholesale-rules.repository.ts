import type { WholesaleRules, UpdateWholesaleRulesInput } from "@/domain/entities/wholesale-rules.entity";

export interface WholesaleRulesRepository {
  get(): Promise<WholesaleRules>;
  update(input: UpdateWholesaleRulesInput): Promise<void>;
}
