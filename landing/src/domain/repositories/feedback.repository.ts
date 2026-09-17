import type { Feedback, CreateFeedbackInput } from "@/domain/entities/feedback.entity";

export interface FeedbackRepository {
  create(input: CreateFeedbackInput): Promise<Feedback>;
}
