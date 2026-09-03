/**
 * calculateFinalPrice — shared utility for computing the final price of a product.
 *
 * Priority: individual product discount > category discount > base price.
 * Also handles wholesale pricing based on user role.
 */

export interface ProductForPricing {
  price: number;
  wholesalePrice?: number;
  isDiscounted: boolean;
  discountPercentage?: number;
}

export interface CategoryDiscount {
  type: "percentage" | "fixed";
  value: number;
  isActive: boolean;
}

export interface PricingOptions {
  role?: "customer" | "wholesale" | "admin" | "superadmin";
  categoryDiscount?: CategoryDiscount;
}

export interface PricingResult {
  finalPrice: number;
  originalPrice: number;
  isDiscounted: boolean;
  discountPercentage: number;
  discountLabel: string | null;
}

const MAX_DISCOUNT_PERCENTAGE = 90;

export function calculateFinalPrice(
  product: ProductForPricing,
  options: PricingOptions = {}
): PricingResult {
  const { role = "customer", categoryDiscount } = options;

  const isWholesaler = role === "wholesale";
  const basePrice = isWholesaler && product.wholesalePrice != null && product.wholesalePrice > 0
    ? product.wholesalePrice
    : product.price;

  if (product.isDiscounted && product.discountPercentage != null && product.discountPercentage > 0) {
    const cappedPct = Math.min(product.discountPercentage, MAX_DISCOUNT_PERCENTAGE);
    const discounted = Math.round(basePrice * (1 - cappedPct / 100));
    const finalPrice = Math.max(discounted, 1);

    return {
      finalPrice,
      originalPrice: basePrice,
      isDiscounted: true,
      discountPercentage: cappedPct,
      discountLabel: `-${cappedPct}%`,
    };
  }

  if (categoryDiscount?.isActive && categoryDiscount.value > 0) {
    const discounted = categoryDiscount.type === "percentage"
      ? Math.round(basePrice * (1 - Math.min(categoryDiscount.value, MAX_DISCOUNT_PERCENTAGE) / 100))
      : basePrice - categoryDiscount.value;

    const discountPct = categoryDiscount.type === "percentage"
      ? categoryDiscount.value
      : Math.round((categoryDiscount.value / basePrice) * 100);

    const finalPrice = Math.max(discounted, 1);

    return {
      finalPrice,
      originalPrice: basePrice,
      isDiscounted: true,
      discountPercentage: Math.min(discountPct, MAX_DISCOUNT_PERCENTAGE),
      discountLabel: categoryDiscount.type === "percentage"
        ? `-${categoryDiscount.value}%`
        : `-Bs. ${categoryDiscount.value}`,
    };
  }

  return {
    finalPrice: basePrice,
    originalPrice: basePrice,
    isDiscounted: false,
    discountPercentage: 0,
    discountLabel: null,
  };
}
