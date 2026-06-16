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
