import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";

export async function getFeedbacks(repo: FeedbackRepository) {
  return repo.findAll();
}
