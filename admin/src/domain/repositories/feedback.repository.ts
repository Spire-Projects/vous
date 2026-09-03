import type { Feedback, CreateFeedbackInput, UpdateFeedbackInput } from "@/domain/entities/feedback.entity";

export interface FeedbackRepository {
  findAll(): Promise<Feedback[]>;
  findById(id: string): Promise<Feedback | null>;
  create(input: CreateFeedbackInput): Promise<Feedback>;
  update(id: string, input: UpdateFeedbackInput): Promise<void>;
  delete(id: string): Promise<void>;
  setStatus(id: string, status: Feedback["status"]): Promise<void>;
}
