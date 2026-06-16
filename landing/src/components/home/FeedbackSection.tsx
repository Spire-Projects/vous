"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useCreateFeedback } from "@/hooks/useCreateFeedback";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  MessageSquareHeart,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export function FeedbackSection() {
  const { user, userProfile } = useAuthContext();
  const { submit, loading, success } = useCreateFeedback();
  const [type, setType] = useState<"recomendacion" | "queja">("recomendacion");
  const [message, setMessage] = useState("");

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
    <section className="relative bg-[#0D0D0C] overflow-hidden">
      {/* Decorative gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-nav text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4 block"
          >
            Tu Voz Importa
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl md:text-5xl text-white leading-tight mb-5"
          >
            Quejas o Recomendaciones
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-sm text-white/50 leading-relaxed max-w-md mx-auto"
          >
            Queremos escucharte. Tu opinión nos ayuda a mejorar la experiencia VOUS.
            Envíanos tus quejas o recomendaciones y las revisaremos con atención.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10">
            <AnimatePresence mode="wait">
              {!user ? (
                <motion.div
                  key="unauth"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center gap-6 py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                    <MessageSquareHeart size={28} className="text-[#C9A84C]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif text-xl text-white mb-2">
                      Inicia sesión para compartir tu opinión
                    </p>
                    <p className="font-sans text-sm text-white/40">
                      Tu feedback nos ayuda a construir una mejor experiencia VOUS.
                    </p>
                  </div>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0D0D0C] font-nav text-[11px] uppercase tracking-wider rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Iniciar sesión <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ) : success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center gap-5 py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-[#C9A84C]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-white mb-2">¡Gracias por tu mensaje!</p>
                    <p className="font-sans text-sm text-white/40">
                      Lo hemos recibido correctamente y lo revisaremos con atención.
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white/70 font-nav text-[11px] uppercase tracking-wider rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Type selector */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("recomendacion")}
                      className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl border text-sm font-sans transition-all duration-200 ${
                        type === "recomendacion"
                          ? "bg-[#C9A84C] border-[#C9A84C] text-[#0D0D0C]"
                          : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white/70"
                      }`}
                    >
                      <Lightbulb size={16} strokeWidth={1.5} />
                      Recomendación
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("queja")}
                      className={`flex items-center justify-center gap-2.5 py-3.5 rounded-xl border text-sm font-sans transition-all duration-200 ${
                        type === "queja"
                          ? "bg-white border-white text-[#0D0D0C]"
                          : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white/70"
                      }`}
                    >
                      <AlertTriangle size={16} strokeWidth={1.5} />
                      Queja
                    </button>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="font-nav text-[10px] tracking-[0.2em] uppercase text-white/40 block">
                      Mensaje
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos tu experiencia con VOUS..."
                      rows={5}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white text-[#0D0D0C] font-nav text-[11px] uppercase tracking-wider rounded-xl hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#0D0D0C]/30 border-t-[#0D0D0C] rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    {loading ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
