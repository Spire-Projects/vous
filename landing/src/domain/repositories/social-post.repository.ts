import type { SocialPost } from "@/domain/entities/social-post.entity";

export interface SocialPostRepository {
  findAllActive(): Promise<SocialPost[]>;
}
