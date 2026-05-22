import type { DiscountRepository } from "@/domain/repositories/discount.repository";
import type { Discount } from "@/domain/entities/discount.entity";

export interface ValidateDiscountInput {
  code: string;
  subtotal: number;
  categoryIds?: string[];
  productIds?: string[];
}

export interface ValidateDiscountResult {
  valid: boolean;
  discount?: Discount;
  discountAmount: number;
  error?: string;
}

/**
 * Validates whether a discount code can be applied to the current cart.
 * Checks activity, expiration, usage limits, minimum purchase, and scope.
 */
export async function validateDiscountCode(
  repo: DiscountRepository,
  input: ValidateDiscountInput
): Promise<ValidateDiscountResult> {
  if (!input.code.trim()) {
    return { valid: false, discountAmount: 0, error: "Código no ingresado" };
  }

  const discount = await repo.findByCode(input.code.trim());

  if (!discount) {
    return { valid: false, discountAmount: 0, error: "Código de descuento no válido" };
  }

  if (!discount.isActive) {
    return { valid: false, discountAmount: 0, error: "Este código ya no está activo" };
  }

  // Check expiration
  if (discount.endDate) {
    const now = new Date();
    const end = new Date(discount.endDate);
    if (now > end) {
      return { valid: false, discountAmount: 0, error: "Este código ha expirado" };
    }
  }

  // Check start date
  if (discount.startDate) {
    const now = new Date();
    const start = new Date(discount.startDate);
    if (now < start) {
      return { valid: false, discountAmount: 0, error: "Este código aún no está vigente" };
    }
  }

  // Check max uses
  if (discount.maxUses != null && discount.usedCount >= discount.maxUses) {
    return { valid: false, discountAmount: 0, error: "Este código ha alcanzado su límite de usos" };
  }

  // Check minimum purchase
  if (discount.minPurchase != null && input.subtotal < discount.minPurchase) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Compra mínima de Bs. ${discount.minPurchase} requerida para este cupón`,
    };
  }

  // Check scope (simplified — full scope check happens server-side)
  if (discount.applicableTo === "categories" && discount.categoryIds?.length) {
    const hasMatch = input.categoryIds?.some((id) => discount.categoryIds!.includes(id));
    if (!hasMatch) {
      return {
        valid: false,
        discountAmount: 0,
        error: "Este cupón no aplica a los productos de tu carrito",
      };
    }
  }

  if (discount.applicableTo === "products" && discount.productIds?.length) {
    const hasMatch = input.productIds?.some((id) => discount.productIds!.includes(id));
    if (!hasMatch) {
      return {
        valid: false,
        discountAmount: 0,
        error: "Este cupón no aplica a los productos de tu carrito",
      };
    }
  }

  const discountAmount =
    discount.type === "percentage"
      ? Math.round(input.subtotal * (discount.value / 100))
      : discount.value;

  return {
    valid: true,
    discount,
    discountAmount: Math.min(discountAmount, input.subtotal),
  };
}
