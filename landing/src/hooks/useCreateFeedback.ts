import { useState } from "react";
import { firestoreFeedbackRepository } from "@/infrastructure";
import type { FeedbackType } from "@/domain/entities/feedback.entity";

export function useCreateFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(
    userId: string,
    userName: string,
    userEmail: string,
    type: FeedbackType,
    message: string
  ) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await firestoreFeedbackRepository.create({
        userId,
        userName,
        userEmail,
        type,
        message,
        status: "pending",
      });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar");
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, success };
}
