"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useFAQs } from "@/hooks/useFaqs";

export function FAQSection() {
  const { faqs, loading, error } = useFAQs();
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex justify-center">
          <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="font-sans text-sm text-black/50">
            No se pudieron cargar las preguntas frecuentes. Revisa la consola para más detalles.
          </p>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <p className="font-nav text-[11px] tracking-[0.25em] text-black uppercase mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-black">¿Tienes dudas?</h2>
          <p className="font-sans text-sm text-black/50 mt-3">
            Aún no hay preguntas frecuentes configuradas. Agrégalas desde el panel de
            administración.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="font-nav text-[11px] tracking-[0.25em] text-black uppercase mb-3">
              Preguntas frecuentes
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-black">¿Tienes dudas?</h2>
            <p className="font-sans text-sm text-black/50 mt-3 max-w-md leading-relaxed">
              Encuentra respuestas sobre compras, envíos, tallas y políticas de la tienda.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-black">
            <HelpCircle size={20} strokeWidth={1.5} />
            <span className="font-nav text-[11px] tracking-[0.2em] uppercase">
              {faqs.length} preguntas
            </span>
          </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-black/10 bg-white overflow-hidden rounded-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-nav text-[13px] font-semibold tracking-wide text-black uppercase">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="shrink-0 text-black"
                  >
                    <ChevronDown size={18} strokeWidth={1.5} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        <div className="border-t border-black/10 pt-4">
                          <div
                            className="faq-answer max-w-none font-sans text-sm text-black/50 leading-relaxed [&_strong]:font-semibold [&_strong]:text-black [&_em]:italic [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-black [&_h2]:mt-4 [&_h2]:mb-2 [&_blockquote]:border-l-[3px] [&_blockquote]:border-black [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-black/50 [&_a]:text-black [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
