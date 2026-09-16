import type { CreateOrderInput, ShippingInfo } from "@/domain/entities/order.entity";
import type { CartItem } from "@/types/cart.types";
import type { ShippingForm } from "@/components/checkout/CheckoutFormStep";

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
  subtotal: number
): CreateOrderInput {
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
      variantId: null,
      productName: item.name,
      variantDescription: [item.size, item.color].filter(Boolean).join(" / ") || undefined,
      imageUrl: item.image,
      unitPrice: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      isWholesalePrice: false,
    })),
    subtotal,
    total: subtotal,
    paymentMethod: "qr",
    shippingInfo,
    isWholesale: false,
  };
}
