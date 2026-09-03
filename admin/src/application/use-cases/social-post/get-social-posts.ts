import type { SocialPostRepository } from "@/domain/repositories/social-post.repository";

export async function getSocialPosts(repo: SocialPostRepository) {
  return repo.findAll();
}
