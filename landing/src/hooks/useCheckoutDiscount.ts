"use client";

import { useState } from "react";
import { firestoreDiscountRepository } from "@/infrastructure/repositories/firestore-discount.repository";
import { validateDiscountCode } from "@/application/use-cases/discount/validate-discount-code";
import type { CartItem } from "@/types/cart.types";

export function useCheckoutDiscount(items: CartItem[], subtotal: number) {
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState<string | null>(null);

  async function handleApplyDiscount() {
    if (!discountCode.trim()) return;
    setDiscountError(null);
    try {
      const result = await validateDiscountCode(firestoreDiscountRepository, {
        code: discountCode.trim(),
        subtotal,
        categoryIds: items.map((i) => i.categoryId).filter((id): id is string => !!id),
        productIds: items.map((i) => i.productId),
      });
      if (result.valid) {
        setDiscountAmount(result.discountAmount);
        setDiscountError(null);
      } else {
        setDiscountAmount(0);
        setDiscountError(result.error ?? "Código no válido");
      }
    } catch {
      setDiscountError("Error al validar el código de descuento");
      setDiscountAmount(0);
    }
  }

  return {
    discountCode,
    setDiscountCode,
    discountAmount,
    discountError,
    handleApplyDiscount,
  };
}
