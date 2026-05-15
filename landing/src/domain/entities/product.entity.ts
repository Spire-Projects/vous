export interface ProductColor {
  hex: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  badge?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  materials: string[];
  stock: number;
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}
