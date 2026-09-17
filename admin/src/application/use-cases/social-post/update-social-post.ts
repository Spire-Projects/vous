import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";
import type { UpdateSocialPostInput } from "@/domain/entities/social-post.entity";

export async function updateSocialPost(repo: SocialPostRepository, id: string, input: UpdateSocialPostInput) {
  return repo.update(id, input);
}
