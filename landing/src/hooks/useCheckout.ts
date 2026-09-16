"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { createOrder } from "@/application/use-cases/order/create-order";
import { validateStock, type OutOfStockItem } from "@/application/use-cases/order/validate-stock";
import { uploadPaymentProof } from "@/application/use-cases/order/upload-payment-proof";
import { uploadFileToCloudinary } from "@/utils/cloudinary-upload";
import { validateShippingForm, buildCreateOrderInput } from "@/utils/checkout.utils";
import type { ShippingForm } from "@/components/checkout/CheckoutFormStep";

type Step = "form" | "payment" | "success";

export function useCheckout() {
  const router = useRouter();
  const { items, clearCart, removeItem, updateQuantity } = useCart();
  const { user, userProfile } = useAuth();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<ShippingForm>({
    fullName: userProfile?.name ?? "",
    email: user?.email ?? "",
    phone: userProfile?.phone ?? "",
    department: userProfile?.departamento ?? "",
    city: "",
    address: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [stockErrors, setStockErrors] = useState<OutOfStockItem[]>([]);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

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
      const outOfStock = await validateStock(firestoreProductRepository, items);
      if (outOfStock.length > 0) {
        setStockErrors(outOfStock);
        return;
      }
      setStockErrors([]);

      const input = buildCreateOrderInput(user.uid, form, items, subtotal);
      const order = await createOrder(firestoreOrderRepository, input);
      setCreatedOrderId(order.id);
      setOrderNumber(order.orderNumber);
      setStep("payment");
    } catch {
      setFormError("Ocurrió un error al crear el pedido. Intenta nuevamente.");
    } finally {
      setCreatingOrder(false);
    }
  }

  async function handleSubmitProof() {
    if (!proofFile || !createdOrderId) return;
    setUploading(true);
    setProofError(null);
    try {
      const url = await uploadFileToCloudinary(proofFile, "vous/comprobantes");
      await uploadPaymentProof(firestoreOrderRepository, createdOrderId, url);
      clearCart();
      setStep("success");
    } catch (e) {
      setProofError(e instanceof Error ? e.message : "Error al subir el comprobante.");
    } finally {
      setUploading(false);
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
    proofFile,
    setProofFile,
    proofError,
    uploading,
    handleProceedToPayment,
    handleSubmitProof,
    adjustStockToAvailable,
  };
}
