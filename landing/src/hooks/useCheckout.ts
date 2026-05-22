"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { firestoreDiscountRepository } from "@/infrastructure/repositories/firestore-discount.repository";
import { firestoreWholesaleRulesRepository } from "@/infrastructure/repositories/firestore-wholesale-rules.repository";
import { createOrder } from "@/application/use-cases/order/create-order";
import { validateStock, type OutOfStockItem } from "@/application/use-cases/order/validate-stock";
import { decrementVariantStock } from "@/application/use-cases/product/decrement-variant-stock";
import { uploadPaymentProof } from "@/application/use-cases/order/upload-payment-proof";
import { uploadFileToCloudinary } from "@/utils/cloudinary-upload";
import { validateDiscountCode } from "@/application/use-cases/discount/validate-discount-code";
import { validateWholesaleCheckout } from "@/application/use-cases/wholesale/validate-wholesale-checkout";
import type { ShippingInfo, CreateOrderInput } from "@/domain/entities/order.entity";
import type { ShippingForm } from "@/components/checkout/CheckoutFormStep";

type Step = "form" | "payment" | "success";

export function useCheckout() {
  const router = useRouter();
  const { items, clearCart } = useCart();
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
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [wholesaleErrors, setWholesaleErrors] = useState<string[]>([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  function validate(): string | null {
    if (!form.fullName.trim()) return "El nombre completo es requerido.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Ingresa un correo electrónico válido.";
    if (!form.phone.trim()) return "El número de celular es requerido.";
    if (!form.department.trim()) return "El departamento es requerido.";
    if (!form.city.trim()) return "La ciudad es requerida.";
    if (!form.address.trim()) return "La dirección es requerida.";
    if (items.length === 0) return "Tu carrito está vacío.";
    return null;
  }

  async function handleProceedToPayment() {
    const err = validate();
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
      // Validate wholesale checkout rules
      const role = (userProfile?.role ?? "") as string;
      const isWholesaler = role === "wholesale" || role === "wholesaler";
      if (isWholesaler) {
        const whResult = await validateWholesaleCheckout(firestoreWholesaleRulesRepository, {
          subtotal: subtotal - discountAmount,
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

      const shippingInfo: ShippingInfo = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        department: form.department.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        shippingType: "national",
      };
      const input: CreateOrderInput = {
        customerId: user.uid,
        customerSnapshot: {
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          department: form.department.trim(),
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          productName: item.name,
          variantDescription: [item.size, item.color].filter(Boolean).join(" / ") || undefined,
          imageUrl: item.image,
          unitPrice: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          isWholesalePrice: false,
        })),
        subtotal,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        total: discountAmount > 0 ? subtotal - discountAmount : subtotal,
        paymentMethod: "qr",
        shippingInfo,
        isWholesale: isWholesaler,
        discountCode: discountAmount > 0 ? discountCode : undefined,
      };
      const order = await createOrder(firestoreOrderRepository, input);
      // Decrement variant stock atomically for each variant item
      await Promise.all(
        items
          .filter((i) => i.variantId)
          .map((i) =>
            decrementVariantStock(firestoreProductRepository, i.productId, i.variantId!, i.quantity)
          )
      );
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

  const finalTotal = subtotal - discountAmount;

  return {
    step,
    items,
    subtotal,
    form,
    setForm,
    formError,
    stockErrors,
    creatingOrder,
    orderNumber,
    proofFile,
    setProofFile,
    proofError,
    uploading,
    discountCode,
    setDiscountCode,
    discountAmount,
    discountError,
    wholesaleErrors,
    finalTotal,
    handleProceedToPayment,
    handleSubmitProof,
    handleApplyDiscount,
  };
}
