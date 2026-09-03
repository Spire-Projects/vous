import type { SocialPost, CreateSocialPostInput, UpdateSocialPostInput } from "@/domain/entities/social-post.entity";

export interface SocialPostRepository {
  findAll(): Promise<SocialPost[]>;
  findById(id: string): Promise<SocialPost | null>;
  create(input: CreateSocialPostInput): Promise<SocialPost>;
  update(id: string, input: UpdateSocialPostInput): Promise<void>;
  delete(id: string): Promise<void>;
  setActive(id: string, active: boolean): Promise<void>;
  setOrder(id: string, order: number): Promise<void>;
}
