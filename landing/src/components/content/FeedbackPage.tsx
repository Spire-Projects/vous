"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FeedbackPage() {
  const { config, loading } = useSiteConfig();
  const feedback = config?.feedback;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "recomendacion",
    message: "",
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-vous-warm-white">
        <span className="inline-block w-6 h-6 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!feedback?.isActive) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-vous-warm-white px-5">
        <p className="font-sans text-sm text-vous-gray">Esta sección no está disponible.</p>
        <Link
          href="/"
          className="font-nav text-[11px] uppercase tracking-wider text-vous-gold hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simulate submission (no backend endpoint available)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[720px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-vous-gray hover:text-vous-gold transition-colors mb-10"
        >
          <ArrowLeft size={12} /> Volver al inicio
        </Link>

        <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-4 block">
          {feedback.subtitle || "Retroalimentación"}
        </span>
        <h1 className="font-serif text-[36px] md:text-[64px] leading-[1.08] text-vous-soft-black mb-8">
          {feedback.title || "Quejas o Recomendaciones"}
        </h1>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <CheckCircle size={48} className="text-vous-gold" strokeWidth={1.5} />
            <p className="font-sans text-lg text-vous-soft-black">
              {feedback.successMessage || "Gracias por tu mensaje. Lo hemos recibido correctamente."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", type: "recomendacion", message: "" });
              }}
            >
              Enviar otro mensaje
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="feedback-name">Nombre</Label>
                <Input
                  id="feedback-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="feedback-email">Email</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tipo de mensaje</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-type"
                    value="recomendacion"
                    checked={formData.type === "recomendacion"}
                    onChange={() => setFormData({ ...formData, type: "recomendacion" })}
                    className="accent-vous-gold"
                  />
                  <span className="font-sans text-sm text-vous-soft-black">Recomendación</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-type"
                    value="queja"
                    checked={formData.type === "queja"}
                    onChange={() => setFormData({ ...formData, type: "queja" })}
                    className="accent-vous-gold"
                  />
                  <span className="font-sans text-sm text-vous-soft-black">Queja</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback-message">Mensaje</Label>
              <textarea
                id="feedback-message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Cuéntanos tu experiencia..."
                rows={5}
                required
                className="flex w-full rounded-md border border-vous-gray-light/60 bg-transparent px-3 py-2 text-sm text-vous-soft-black placeholder:text-vous-gray focus:outline-none focus:ring-1 focus:ring-vous-gold focus:border-vous-gold disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-vous-soft-black text-white font-nav text-[11px] uppercase tracking-wider hover:bg-vous-gold transition-colors"
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
