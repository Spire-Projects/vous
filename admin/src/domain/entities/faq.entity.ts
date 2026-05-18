/**
 * FAQ entity — dominio puro sin dependencias de framework.
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateFAQInput {
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export type UpdateFAQInput = Partial<CreateFAQInput>;
