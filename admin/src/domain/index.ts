// ── Domain layer — barrel export ──────────────────────────────────────────
export type { Product, ProductVariant } from "./entities/product.entity";
export type { Order, OrderItem, OrderStatus, PaymentMethod, UpdateOrderStatusInput } from "./entities/order.entity";
export type { Customer, AdminUser, CustomerRole, AdminRole } from "./entities/user.entity";
export type { WholesaleRequest, WholesaleRequestStatus, ReviewWholesaleInput } from "./entities/wholesale.entity";
export type { BlogPost, BlogPostStatus, CreateBlogPostInput, UpdateBlogPostInput } from "./entities/blog-post.entity";
export type { FAQ, CreateFAQInput, UpdateFAQInput } from "./entities/faq.entity";

export type { ProductRepository } from "./repositories/product.repository";
export type { OrderRepository } from "./repositories/order.repository";
export type { CustomerRepository, AdminUserRepository } from "./repositories/user.repository";
export type { WholesaleRepository } from "./repositories/wholesale.repository";
export type { BlogPostRepository } from "./repositories/blog-post.repository";
export type { FAQRepository } from "./repositories/faq.repository";
