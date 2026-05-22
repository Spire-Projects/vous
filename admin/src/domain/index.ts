// ── Domain layer — barrel export ──────────────────────────────────────────
export type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductVariant,
  CreateVariantInput,
  UpdateVariantInput,
} from "./entities/product.entity";
export type { Order, OrderItem, OrderStatus, PaymentMethod, UpdateOrderStatusInput } from "./entities/order.entity";
export type { Customer, AdminUser, CustomerRole, AdminRole } from "./entities/user.entity";
export type { WholesaleRequest, WholesaleRequestStatus, ReviewWholesaleInput } from "./entities/wholesale.entity";
export type { BlogPost, BlogPostStatus, CreateBlogPostInput, UpdateBlogPostInput } from "./entities/blog-post.entity";
export type { FAQ, CreateFAQInput, UpdateFAQInput } from "./entities/faq.entity";
export type { Banner, CreateBannerInput, UpdateBannerInput } from "./entities/banner.entity";
export type { SiteConfig, UpdateSiteConfigInput, ScheduleItem, SocialNetwork } from "./entities/site-config.entity";
export type { Category } from "./entities/category.entity";
export type {
  LandingSection,
  LandingSectionType,
  CreateLandingSectionInput,
  UpdateLandingSectionInput,
} from "./entities/landing-section.entity";
export { LANDING_SECTION_TYPE_LABELS, LANDING_SECTION_TYPE_COLORS } from "./entities/landing-section.entity";

export type { ProductRepository } from "./repositories/product.repository";
export type { OrderRepository } from "./repositories/order.repository";
export type { CustomerRepository, AdminUserRepository } from "./repositories/user.repository";
export type { WholesaleRepository } from "./repositories/wholesale.repository";
export type { BlogPostRepository } from "./repositories/blog-post.repository";
export type { FAQRepository } from "./repositories/faq.repository";
export type { BannerRepository } from "./repositories/banner.repository";
export type { SiteConfigRepository } from "./repositories/site-config.repository";
export type { CategoryRepository } from "./repositories/category.repository";
export type { LandingSectionRepository } from "./repositories/landing-section.repository";
export type { Discount, DiscountType, DiscountScope, CreateDiscountInput, UpdateDiscountInput } from "./entities/discount.entity";
export type { DiscountRepository } from "./repositories/discount.repository";
export type { WholesaleRules, UpdateWholesaleRulesInput } from "./entities/wholesale-rules.entity";
export type { WholesaleRulesRepository } from "./repositories/wholesale-rules.repository";
