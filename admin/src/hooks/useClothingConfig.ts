import { useEffect, useState, useCallback } from "react";
import {
  firestoreSizeRepository,
  firestoreMaterialRepository,
  firestoreAttributeRepository,
  firestoreBadgeRepository,
} from "@/infrastructure/repositories/firestore-clothing-config.repository";
import type {
  ClothingSize, CreateClothingSizeInput,
  ClothingMaterial, CreateClothingMaterialInput,
  ClothingAttribute, CreateClothingAttributeInput,
  ClothingBadge, CreateClothingBadgeInput,
} from "@/domain/entities/clothing-config.entity";

export function useClothingConfig() {
  const [sizes, setSizes] = useState<ClothingSize[]>([]);
  const [materials, setMaterials] = useState<ClothingMaterial[]>([]);
  const [attributes, setAttributes] = useState<ClothingAttribute[]>([]);
  const [badges, setBadges] = useState<ClothingBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, m, a, b] = await Promise.all([
        firestoreSizeRepository.findAll(),
        firestoreMaterialRepository.findAll(),
        firestoreAttributeRepository.findAll(),
        firestoreBadgeRepository.findAll(),
      ]);
      setSizes(s);
      setMaterials(m);
      setAttributes(a);
      setBadges(b);
    } catch (err) {
      console.error("[useClothingConfig] Error cargando configuración de ropa:", err);
      setError("Error al cargar la configuración de ropa");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [s, m, a, b] = await Promise.all([
          firestoreSizeRepository.findAll(),
          firestoreMaterialRepository.findAll(),
          firestoreAttributeRepository.findAll(),
          firestoreBadgeRepository.findAll(),
        ]);
        if (!cancelled) {
          setSizes(s);
          setMaterials(m);
          setAttributes(a);
          setBadges(b);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useClothingConfig] Error cargando configuración de ropa:", err);
          setError("Error al cargar la configuración de ropa");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /* ── Sizes ── */
  async function createSize(data: CreateClothingSizeInput) {
    const item = await firestoreSizeRepository.save(data);
    setSizes((prev) => [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder));
  }
  async function updateSize(id: string, data: Partial<CreateClothingSizeInput>) {
    const defined = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    await firestoreSizeRepository.update(id, defined);
    setSizes((prev) => prev.map((i) => (i.id === id ? { ...i, ...defined } : i)));
  }
  async function removeSize(id: string) {
    await firestoreSizeRepository.remove(id);
    setSizes((prev) => prev.filter((i) => i.id !== id));
  }
  async function reorderSizes(items: { id: string; sortOrder: number }[]) {
    const map = new Map(items.map((i) => [i.id, i.sortOrder]));
    setSizes((prev) =>
      [...prev.map((c) => ({ ...c, sortOrder: map.get(c.id) ?? c.sortOrder }))]
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
    await firestoreSizeRepository.updateOrder(items);
  }

  /* ── Materials ── */
  async function createMaterial(data: CreateClothingMaterialInput) {
    const item = await firestoreMaterialRepository.save(data);
    setMaterials((prev) => [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder));
  }
  async function updateMaterial(id: string, data: Partial<CreateClothingMaterialInput>) {
    const defined = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    await firestoreMaterialRepository.update(id, defined);
    setMaterials((prev) => prev.map((i) => (i.id === id ? { ...i, ...defined } : i)));
  }
  async function removeMaterial(id: string) {
    await firestoreMaterialRepository.remove(id);
    setMaterials((prev) => prev.filter((i) => i.id !== id));
  }
  async function reorderMaterials(items: { id: string; sortOrder: number }[]) {
    const map = new Map(items.map((i) => [i.id, i.sortOrder]));
    setMaterials((prev) =>
      [...prev.map((c) => ({ ...c, sortOrder: map.get(c.id) ?? c.sortOrder }))]
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
    await firestoreMaterialRepository.updateOrder(items);
  }

  /* ── Attributes ── */
  async function createAttribute(data: CreateClothingAttributeInput) {
    const item = await firestoreAttributeRepository.save(data);
    setAttributes((prev) => [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder));
  }
  async function updateAttribute(id: string, data: Partial<CreateClothingAttributeInput>) {
    const defined = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    await firestoreAttributeRepository.update(id, defined);
    setAttributes((prev) => prev.map((i) => (i.id === id ? { ...i, ...defined } : i)));
  }
  async function removeAttribute(id: string) {
    await firestoreAttributeRepository.remove(id);
    setAttributes((prev) => prev.filter((i) => i.id !== id));
  }
  async function reorderAttributes(items: { id: string; sortOrder: number }[]) {
    const map = new Map(items.map((i) => [i.id, i.sortOrder]));
    setAttributes((prev) =>
      [...prev.map((c) => ({ ...c, sortOrder: map.get(c.id) ?? c.sortOrder }))]
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
    await firestoreAttributeRepository.updateOrder(items);
  }

  /* ── Badges ── */
  async function createBadge(data: CreateClothingBadgeInput) {
    const item = await firestoreBadgeRepository.save(data);
    setBadges((prev) => [...prev, item].sort((a, b) => a.sortOrder - b.sortOrder));
  }
  async function updateBadge(id: string, data: Partial<CreateClothingBadgeInput>) {
    const defined = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    await firestoreBadgeRepository.update(id, defined);
    setBadges((prev) => prev.map((i) => (i.id === id ? { ...i, ...defined } : i)));
  }
  async function removeBadge(id: string) {
    await firestoreBadgeRepository.remove(id);
    setBadges((prev) => prev.filter((i) => i.id !== id));
  }
  async function reorderBadges(items: { id: string; sortOrder: number }[]) {
    const map = new Map(items.map((i) => [i.id, i.sortOrder]));
    setBadges((prev) =>
      [...prev.map((c) => ({ ...c, sortOrder: map.get(c.id) ?? c.sortOrder }))]
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
    await firestoreBadgeRepository.updateOrder(items);
  }

  return {
    sizes, materials, attributes, badges,
    loading, error,
    createSize, updateSize, removeSize, reorderSizes,
    createMaterial, updateMaterial, removeMaterial, reorderMaterials,
    createAttribute, updateAttribute, removeAttribute, reorderAttributes,
    createBadge, updateBadge, removeBadge, reorderBadges,
    refresh: loadAll,
  };
}
