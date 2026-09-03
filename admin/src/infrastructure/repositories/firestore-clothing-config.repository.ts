import {
  collection, getDocs, doc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, writeBatch, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  ClothingSize, CreateClothingSizeInput,
  ClothingMaterial, CreateClothingMaterialInput,
  ClothingAttribute, CreateClothingAttributeInput,
  ClothingBadge, CreateClothingBadgeInput,
} from "@/domain/entities/clothing-config.entity";

function toDateString(value: unknown): string {
  const d = (value as { toDate?: () => Date })?.toDate?.();
  return d ? d.toISOString() : new Date().toISOString();
}

/* ───────────── Sizes ───────────── */

function mapSize(id: string, data: Record<string, unknown>): ClothingSize {
  return {
    id,
    name: (data.name as string) ?? "",
    sortOrder: (data.sortOrder as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    createdAt: toDateString(data.createdAt),
    updatedAt: toDateString(data.updatedAt),
  };
}

export const firestoreSizeRepository = {
  async findAll(): Promise<ClothingSize[]> {
    const q = query(collection(db, "clothing_sizes"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapSize(d.id, d.data() as Record<string, unknown>));
  },

  async save(data: CreateClothingSizeInput): Promise<ClothingSize> {
    const ref = await addDoc(collection(db, "clothing_sizes"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return mapSize(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, data: Partial<CreateClothingSizeInput>): Promise<void> {
    await updateDoc(doc(db, "clothing_sizes", id), { ...data, updatedAt: serverTimestamp() });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, "clothing_sizes", id));
  },

  async updateOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const batch = writeBatch(db);
    for (const { id, sortOrder } of items) {
      batch.update(doc(db, "clothing_sizes", id), { sortOrder });
    }
    await batch.commit();
  },
};

/* ───────────── Materials ───────────── */

function mapMaterial(id: string, data: Record<string, unknown>): ClothingMaterial {
  return {
    id,
    name: (data.name as string) ?? "",
    sortOrder: (data.sortOrder as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    createdAt: toDateString(data.createdAt),
    updatedAt: toDateString(data.updatedAt),
  };
}

export const firestoreMaterialRepository = {
  async findAll(): Promise<ClothingMaterial[]> {
    const q = query(collection(db, "clothing_materials"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapMaterial(d.id, d.data() as Record<string, unknown>));
  },

  async save(data: CreateClothingMaterialInput): Promise<ClothingMaterial> {
    const ref = await addDoc(collection(db, "clothing_materials"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return mapMaterial(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, data: Partial<CreateClothingMaterialInput>): Promise<void> {
    await updateDoc(doc(db, "clothing_materials", id), { ...data, updatedAt: serverTimestamp() });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, "clothing_materials", id));
  },

  async updateOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const batch = writeBatch(db);
    for (const { id, sortOrder } of items) {
      batch.update(doc(db, "clothing_materials", id), { sortOrder });
    }
    await batch.commit();
  },
};

/* ───────────── Attributes ───────────── */

function mapAttribute(id: string, data: Record<string, unknown>): ClothingAttribute {
  return {
    id,
    name: (data.name as string) ?? "",
    label: (data.label as string) ?? "",
    sortOrder: (data.sortOrder as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    createdAt: toDateString(data.createdAt),
    updatedAt: toDateString(data.updatedAt),
  };
}

export const firestoreAttributeRepository = {
  async findAll(): Promise<ClothingAttribute[]> {
    const q = query(collection(db, "clothing_attributes"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapAttribute(d.id, d.data() as Record<string, unknown>));
  },

  async save(data: CreateClothingAttributeInput): Promise<ClothingAttribute> {
    const ref = await addDoc(collection(db, "clothing_attributes"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return mapAttribute(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, data: Partial<CreateClothingAttributeInput>): Promise<void> {
    await updateDoc(doc(db, "clothing_attributes", id), { ...data, updatedAt: serverTimestamp() });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, "clothing_attributes", id));
  },

  async updateOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const batch = writeBatch(db);
    for (const { id, sortOrder } of items) {
      batch.update(doc(db, "clothing_attributes", id), { sortOrder });
    }
    await batch.commit();
  },
};

/* ───────────── Badges ───────────── */

function mapBadge(id: string, data: Record<string, unknown>): ClothingBadge {
  return {
    id,
    name: (data.name as string) ?? "",
    color: (data.color as string) ?? "#000000",
    sortOrder: (data.sortOrder as number) ?? 0,
    isActive: (data.isActive as boolean) ?? true,
    createdAt: toDateString(data.createdAt),
    updatedAt: toDateString(data.updatedAt),
  };
}

export const firestoreBadgeRepository = {
  async findAll(): Promise<ClothingBadge[]> {
    const q = query(collection(db, "clothing_badges"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapBadge(d.id, d.data() as Record<string, unknown>));
  },

  async save(data: CreateClothingBadgeInput): Promise<ClothingBadge> {
    const ref = await addDoc(collection(db, "clothing_badges"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    return mapBadge(snap.id, snap.data() as Record<string, unknown>);
  },

  async update(id: string, data: Partial<CreateClothingBadgeInput>): Promise<void> {
    await updateDoc(doc(db, "clothing_badges", id), { ...data, updatedAt: serverTimestamp() });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, "clothing_badges", id));
  },

  async updateOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const batch = writeBatch(db);
    for (const { id, sortOrder } of items) {
      batch.update(doc(db, "clothing_badges", id), { sortOrder });
    }
    await batch.commit();
  },
};
