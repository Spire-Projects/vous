import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";
import type { Feedback } from "@/domain/entities/feedback.entity";

export async function setFeedbackStatus(repo: FeedbackRepository, id: string, status: Feedback["status"]) {
  return repo.setStatus(id, status);
}
