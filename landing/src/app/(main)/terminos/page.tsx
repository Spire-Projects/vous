"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
  const { config, loading } = useSiteConfig();
  const policy = config?.termsAndConditions ?? "<p>Términos y Condiciones</p>";

  return (
    <section className="bg-vous-warm-white min-h-[60vh]">
      <div className="max-w-[800px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-10 hover:text-vous-soft-black transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black mb-10">
          Términos y Condiciones
        </h1>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-vous-gray-light/40 rounded w-full" />
            <div className="h-4 bg-vous-gray-light/40 rounded w-5/6" />
            <div className="h-4 bg-vous-gray-light/40 rounded w-4/5" />
          </div>
        ) : (
          <div
            className="prose prose-lg max-w-none font-sans text-vous-gray leading-relaxed prose-headings:font-serif prose-headings:text-vous-soft-black prose-a:text-vous-gold"
            dangerouslySetInnerHTML={{ __html: policy }}
          />
        )}
      </div>
    </section>
  );
}
