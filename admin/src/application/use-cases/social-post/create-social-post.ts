import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";
import type { CreateSocialPostInput } from "@/domain/entities/social-post.entity";

export async function createSocialPost(repo: SocialPostRepository, input: CreateSocialPostInput) {
  return repo.create(input);
}
