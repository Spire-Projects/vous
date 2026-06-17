import { getFirebaseDb } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { WholesaleRulesRepository } from "@/domain/repositories/wholesale-rules.repository";
import type { WholesaleRules } from "@/domain/entities/wholesale-rules.entity";

const DOC_PATH = "wholesaleRules/main";

const DEFAULT_RULES: WholesaleRules = {
  minimumPurchaseAmount: 500,
  minimumPurchaseUnits: 6,
  discountPercentage: 25,
  allowSizeSelection: false,
  restrictions: [],
  notes: "",
  isActive: true,
  termsContent: "<p>Al registrarte como distribuidor mayorista de VOUS, aceptas las siguientes reglas y condiciones de la marca.</p>",
  termsUrl: "",
};

function mapData(data: Record<string, unknown>): WholesaleRules {
  return {
    minimumPurchaseAmount:
      (data.minimumPurchaseAmount as number) ?? DEFAULT_RULES.minimumPurchaseAmount,
    minimumPurchaseUnits:
      (data.minimumPurchaseUnits as number) ?? DEFAULT_RULES.minimumPurchaseUnits,
    discountPercentage: (data.discountPercentage as number) ?? DEFAULT_RULES.discountPercentage,
    allowSizeSelection: (data.allowSizeSelection as boolean) ?? DEFAULT_RULES.allowSizeSelection,
    restrictions: (data.restrictions as string[]) ?? [],
    notes: (data.notes as string) ?? undefined,
    isActive: (data.isActive as boolean) ?? DEFAULT_RULES.isActive,
    termsContent: (data.termsContent as string) ?? DEFAULT_RULES.termsContent,
    termsUrl: (data.termsUrl as string) ?? undefined,
  };
}

export const firestoreWholesaleRulesRepository: WholesaleRulesRepository = {
  async get(): Promise<WholesaleRules> {
    const snap = await getDoc(doc(getFirebaseDb(), DOC_PATH));
    if (!snap.exists()) return DEFAULT_RULES;
    return mapData(snap.data() as Record<string, unknown>);
  },
};
