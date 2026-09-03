"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useCreateFeedback } from "@/hooks/useCreateFeedback";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ArrowLeft, Send, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function FeedbackPage() {
  const { user, userProfile } = useAuthContext();
  const { submit, loading: submitting, success } = useCreateFeedback();
  const { config, loading: configLoading } = useSiteConfig();
  const feedback = config?.feedback;
  const [type, setType] = useState<"recomendacion" | "queja">("recomendacion");
  const [message, setMessage] = useState("");

  if (configLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!feedback?.isActive) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-white px-5">
        <p className="font-sans text-sm text-black/50">Esta sección no está disponible.</p>
        <Link
          href="/"
          className="font-nav text-[11px] uppercase tracking-wider text-black hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !userProfile) return;
    await submit(
      user.uid,
      userProfile.name || user.displayName || "Usuario",
      user.email || userProfile.email || "",
      type,
      message
    );
    setMessage("");
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[720px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={12} /> Volver al inicio
        </Link>

        <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-4 block">
          {feedback.subtitle || "Retroalimentación"}
        </span>
        <h1 className="font-serif text-[36px] md:text-[64px] leading-[1.08] text-black mb-8">
          {feedback.title || "Quejas o Recomendaciones"}
        </h1>

        {!user ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center bg-[#FAF8F5] rounded-2xl border border-black/5">
            <MessageSquare size={48} className="text-black/30" strokeWidth={1.5} />
            <p className="font-sans text-lg text-black">Inicia sesión para enviar tu mensaje</p>
            <p className="font-sans text-sm text-black/50 max-w-sm">
              Debes tener una cuenta para enviar quejas o recomendaciones. Así podemos darte
              seguimiento.
            </p>
            <Button asChild>
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <CheckCircle size={48} className="text-black" strokeWidth={1.5} />
            <p className="font-sans text-lg text-black">
              {feedback.successMessage ||
                "Gracias por tu mensaje. Lo hemos recibido correctamente."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Enviar otro mensaje
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="font-sans text-sm text-black">Tipo de mensaje</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-type"
                    value="recomendacion"
                    checked={type === "recomendacion"}
                    onChange={() => setType("recomendacion")}
                    className="accent-black"
                  />
                  <span className="font-sans text-sm text-black">Recomendación</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-type"
                    value="queja"
                    checked={type === "queja"}
                    onChange={() => setType("queja")}
                    className="accent-black"
                  />
                  <span className="font-sans text-sm text-black">Queja</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback-message" className="font-sans text-sm text-black">
                Mensaje
              </Label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos tu experiencia..."
                rows={5}
                required
                className="flex w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !message.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-nav text-[11px] uppercase tracking-wider hover:bg-black transition-colors"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {submitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
