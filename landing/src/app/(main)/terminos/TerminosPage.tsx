"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";

export function TerminosPage() {
  const { config, loading } = useSiteConfig();

  return (
    <main className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
      <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-4 block text-center">
        Legal
      </span>
      <h1 className="font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.08] text-vous-soft-black mb-8 text-center">
        Términos y Condiciones
      </h1>
      {loading ? (
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-4 bg-vous-cream rounded w-3/4 mx-auto" />
          <div className="h-4 bg-vous-cream rounded w-full mx-auto" />
          <div className="h-4 bg-vous-cream rounded w-2/3 mx-auto" />
        </div>
      ) : (
        <div
          className="prose prose-lg max-w-3xl mx-auto font-sans text-vous-gray leading-relaxed
            prose-headings:font-serif prose-headings:text-vous-soft-black
            prose-a:text-vous-gold prose-a:no-underline hover:prose-a:text-vous-gold-light
            prose-strong:text-vous-soft-black prose-li:text-vous-gray"
          dangerouslySetInnerHTML={{
            __html: config?.termsOfService ?? "<p>No hay información disponible.</p>",
          }}
        />
      )}
    </main>
  );
}
