import type { CreateOrderInput, ShippingInfo } from "@/domain/entities/order.entity";
import type { CartItem } from "@/types/cart.types";
import type { ShippingForm } from "@/components/checkout/CheckoutFormStep";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import { decrementVariantStock } from "@/application/use-cases/product/decrement-variant-stock";
import { decrementStock } from "@/application/use-cases/product/decrement-stock";

export interface BuildOrderOptions {
  discountAmount?: number;
  discountCode?: string;
  isWholesale?: boolean;
}

export function getInitialShippingForm(
  user?: { email?: string | null } | null,
  profile?: {
    name?: string | null;
    phone?: string | null;
    departamento?: string | null;
  } | null
): ShippingForm {
  return {
    fullName: profile?.name ?? "",
    email: user?.email ?? "",
    phone: profile?.phone ?? "",
    department: profile?.departamento ?? "",
    city: "",
    address: "",
  };
}

export function validateShippingForm(f: ShippingForm, count: number): string | null {
  if (!f.fullName.trim()) return "El nombre completo es requerido.";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    return "Ingresa un correo electrónico válido.";
  if (!f.phone.trim()) return "El número de celular es requerido.";
  if (!f.department.trim()) return "El departamento es requerido.";
  if (!f.city.trim()) return "La ciudad es requerida.";
  if (!f.address.trim()) return "La dirección es requerida.";
  if (count === 0) return "Tu carrito está vacío.";
  return null;
}

export function buildCreateOrderInput(
  userId: string,
  form: ShippingForm,
  items: CartItem[],
  subtotal: number,
  options?: BuildOrderOptions
): CreateOrderInput {
  const discountAmount = options?.discountAmount ?? 0;
  const isWholesale = options?.isWholesale ?? false;
  const discountCode = options?.discountCode;

  const shippingInfo: ShippingInfo = {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    department: form.department.trim(),
    city: form.city.trim(),
    address: form.address.trim(),
    shippingType: "national",
  };

  return {
    customerId: userId,
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
    isWholesale,
    discountCode: discountAmount > 0 ? discountCode : undefined,
  };
}

export async function decrementOrderStock(repo: ProductRepository, items: CartItem[]) {
  return Promise.all(
    items.map((i) =>
      i.variantId
        ? decrementVariantStock(repo, i.productId, i.variantId, i.quantity)
        : decrementStock(repo, i.productId, i.quantity)
    )
  );
}
