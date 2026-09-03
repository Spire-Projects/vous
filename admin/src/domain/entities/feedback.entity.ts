/**
 * Feedback entity — complaints and recommendations from users.
 */
export type FeedbackType = "queja" | "recomendacion";
export type FeedbackStatus = "pending" | "reviewed" | "resolved";

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
}

export interface CreateFeedbackInput {
  userId: string;
  userName: string;
  userEmail: string;
  type: FeedbackType;
  message: string;
  status: FeedbackStatus;
}

export type UpdateFeedbackInput = Partial<CreateFeedbackInput>;
