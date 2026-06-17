/**
 * Entidades de configuración de ropa — dominio puro.
 */

export interface ClothingSize {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClothingSizeInput {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ClothingMaterial {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClothingMaterialInput {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ClothingAttribute {
  id: string;
  name: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClothingAttributeInput {
  name: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ClothingBadge {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClothingBadgeInput {
  name: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}
