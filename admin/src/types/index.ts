// ── Barrel export de todos los tipos de VOUS (Admin Panel) ─────────────────

export type { FS, SerializedTimestamp, AnyTimestamp, BaseDocument } from "./base.types";

export type {
  CustomerRole,
  WholesaleStatus,
  User,
  CustomerSnapshot,
  CreateUserPayload,
  UpdateUserPayload,
  AdminRole,
  AdminUser,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "./user.types";

export type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  VariantType,
  ProductAttributes,
  Product,
  ProductVariant,
  CreateProductPayload,
  UpdateProductPayload,
  CreateVariantPayload,
  UpdateVariantPayload,
  ProductWithVariants,
  CatalogFilters,
} from "./product.types";

export type {
  OrderStatus,
  PaymentMethod,
  OrderItem,
  BillingInfo,
  ShippingType,
  ShippingInfo,
  Order,
  OrderStatusEntry,
  StatusHistoryActor,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "./order.types";

export type {
  WholesaleRequestStatus,
  WholesaleRequest,
  CreateWholesaleRequestPayload,
  ReviewWholesaleRequestPayload,
  WholesaleRules,
} from "./wholesale.types";

export type {
  BlogPostStatus,
  BlogPost,
  CreateBlogPostPayload,
  UpdateBlogPostPayload,
} from "./blog.types";

export type {
  Banner,
  CreateBannerPayload,
  UpdateBannerPayload,
  FAQ,
  CreateFAQPayload,
  UpdateFAQPayload,
  LandingSection,
  SocialLinks,
  ContactInfo,
  LandingConfig,
  PaymentConfig,
  SiteConfig,
} from "./content.types";

export type {
  DiscountType,
  DiscountScope,
  Discount,
  CreateDiscountPayload,
  UpdateDiscountPayload,
} from "./discount.types";

export type {
  ReportPeriod,
  DateRange,
  SalesSummary,
  SalesDataPoint,
  TopProduct,
  OrderSummaryRow,
  ReportData,
} from "./report.types";

// ── Tipos de UI (solo admin panel) ─────────────────────────────────────────

export interface MetricCard {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
