/**
 * Wholesale rules entity — dominio puro.
 */
export interface WholesaleRules {
  minimumPurchaseAmount: number;
  minimumPurchaseUnits: number;
  discountPercentage: number;
  allowSizeSelection: boolean;
  restrictions: string[];
  notes?: string;
  isActive: boolean;
  termsContent: string;
  termsUrl?: string;
}

export type UpdateWholesaleRulesInput = Partial<WholesaleRules>;
