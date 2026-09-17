"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";

export function PoliticaDevolucionesPage() {
  const { config, loading } = useSiteConfig();

  return (
    <main className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
      <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-4 block text-center">
        Información
      </span>
      <h1 className="font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.08] text-black mb-8 text-center">
        Política de Devoluciones
      </h1>
      {loading ? (
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-4 bg-white rounded w-3/4 mx-auto" />
          <div className="h-4 bg-white rounded w-full mx-auto" />
          <div className="h-4 bg-white rounded w-2/3 mx-auto" />
        </div>
      ) : (
        <div
          className="policy-content max-w-3xl mx-auto font-sans text-black/50 leading-relaxed [&_strong]:font-semibold [&_strong]:text-black [&_em]:italic [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-black [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-black [&_h3]:mt-5 [&_h3]:mb-2 [&_blockquote]:border-l-[3px] [&_blockquote]:border-black [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-black/50 [&_a]:text-black [&_a]:underline [&_li]:text-black/50 [&_li]:mb-1"
          dangerouslySetInnerHTML={{
            __html: config?.returnPolicy ?? "<p>No hay información disponible.</p>",
          }}
        />
      )}
    </main>
  );
}
