export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
