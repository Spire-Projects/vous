"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCheckoutDiscount } from "@/hooks/useCheckoutDiscount";
import { usePaymentProofUpload } from "@/hooks/usePaymentProofUpload";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { firestoreWholesaleRulesRepository } from "@/infrastructure/repositories/firestore-wholesale-rules.repository";
import { createOrder } from "@/application/use-cases/order/create-order";
import { validateStock, type OutOfStockItem } from "@/application/use-cases/order/validate-stock";
import { validateWholesaleCheckout } from "@/application/use-cases/wholesale/validate-wholesale-checkout";
import {
  validateShippingForm,
  buildCreateOrderInput,
  decrementOrderStock,
  getInitialShippingForm,
} from "@/utils/checkout.utils";
import type { ShippingForm } from "@/components/checkout/CheckoutFormStep";

type Step = "form" | "payment" | "success";

export function useCheckout() {
  const router = useRouter();
  const { items, clearCart, removeItem, updateQuantity } = useCart();
  const { user, userProfile } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<ShippingForm>(getInitialShippingForm(user, userProfile));
  const [formError, setFormError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<OutOfStockItem[]>([]);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [wholesaleErrors, setWholesaleErrors] = useState<string[]>([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const discount = useCheckoutDiscount(items, subtotal);
  const proof = usePaymentProofUpload(createdOrderId, () => {
    clearCart();
    setStep("success");
  });

  function adjustStockToAvailable(outOfStockList: OutOfStockItem[]) {
    outOfStockList.forEach((item) => {
      if (item.available <= 0) removeItem(item.id);
      else updateQuantity(item.id, item.available);
    });
    setStockErrors([]);
  }

  async function handleProceedToPayment() {
    const err = validateShippingForm(form, items.length);
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    setCreatingOrder(true);
    try {
      const role = (userProfile?.role ?? "") as string;
      const isWholesaler = role === "wholesale" || role === "wholesaler";
      if (isWholesaler) {
        const whResult = await validateWholesaleCheckout(firestoreWholesaleRulesRepository, {
          subtotal: subtotal - discount.discountAmount,
          unitCount: items.reduce((s, i) => s + i.quantity, 0),
          userRole: "wholesale",
        });
        if (!whResult.allowed) {
          setWholesaleErrors(whResult.errors);
          return;
        }
      }
      setWholesaleErrors([]);

      const outOfStock = await validateStock(firestoreProductRepository, items);
      if (outOfStock.length > 0) {
        setStockErrors(outOfStock);
        return;
      }
      setStockErrors([]);

      const input = buildCreateOrderInput(user.uid, form, items, subtotal, {
        discountAmount: discount.discountAmount,
        discountCode: discount.discountCode,
        isWholesale: isWholesaler,
      });
      const order = await createOrder(firestoreOrderRepository, input);

      await decrementOrderStock(firestoreProductRepository, items);

      setCreatedOrderId(order.id);
      setOrderNumber(order.orderNumber);
      setStep("payment");
    } catch (err) {
      console.error("[useCheckout] Error al crear el pedido:", err);
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : "Ocurrió un error al crear el pedido. Intenta nuevamente."
      );
    } finally {
      setCreatingOrder(false);
    }
  }

  return {
    step,
    items,
    subtotal,
    form,
    setForm,
    formError,
    stockErrors,
    setStockErrors,
    creatingOrder,
    orderNumber,
    proofFile: proof.proofFile,
    setProofFile: proof.setProofFile,
    proofError: proof.proofError,
    uploading: proof.uploading,
    discountCode: discount.discountCode,
    setDiscountCode: discount.setDiscountCode,
    discountAmount: discount.discountAmount,
    discountError: discount.discountError,
    wholesaleErrors,
    finalTotal: subtotal - discount.discountAmount,
    handleProceedToPayment,
    handleSubmitProof: proof.handleSubmitProof,
    adjustStockToAvailable,
    handleApplyDiscount: discount.handleApplyDiscount,
  };
}
