import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";
import type { UpdateFeedbackInput } from "@/domain/entities/feedback.entity";

export async function updateFeedback(repo: FeedbackRepository, id: string, input: UpdateFeedbackInput) {
  return repo.update(id, input);
}
