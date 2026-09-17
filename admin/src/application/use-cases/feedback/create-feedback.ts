import type { FeedbackRepository } from "@/domain/repositories/feedback.repository";
import type { CreateFeedbackInput } from "@/domain/entities/feedback.entity";

export async function createFeedback(repo: FeedbackRepository, input: CreateFeedbackInput) {
  return repo.create(input);
}
