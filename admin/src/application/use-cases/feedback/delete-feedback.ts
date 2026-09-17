import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";

export async function deleteFeedback(repo: FeedbackRepository, id: string) {
  return repo.delete(id);
}
