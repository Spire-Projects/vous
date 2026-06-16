/**
 * StyleGuide entity — guías de estilo (tono de piel / tipo de cuerpo).
 */
export type StyleGuideType = "skinTone" | "bodyType";
export type StyleGuideGender = "unisex" | "men" | "women";

export interface StyleGuide {
  id: string;
  type: StyleGuideType;
  gender: StyleGuideGender;
  name: string;
  description: string;
  imageUrl: string;
  colorHex?: string;
  recommendedColors: string[];
  recommendedAttributes: string[];
  order: number;
  active: boolean;
  createdAt: string;
}

export interface CreateStyleGuideInput {
  type: StyleGuideType;
  gender: StyleGuideGender;
  name: string;
  description: string;
  imageUrl: string;
  colorHex?: string;
  recommendedColors: string[];
  recommendedAttributes: string[];
  order: number;
  active: boolean;
}

export type UpdateStyleGuideInput = Partial<CreateStyleGuideInput>;
