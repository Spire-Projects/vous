import type { WholesaleRules } from "@/domain/entities/wholesale-rules.entity";

export interface WholesaleRulesRepository {
  get(): Promise<WholesaleRules>;
}
