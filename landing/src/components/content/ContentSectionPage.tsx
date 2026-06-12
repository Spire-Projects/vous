"use client";

import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ArrowLeft } from "lucide-react";
import type { ContentSection } from "@/domain/entities/site-config.entity";

interface ContentSectionPageProps {
  sectionKey: "fashionTrends" | "vousNews" | "newPosts";
  fallbackTitle: string;
  fallbackSubtitle: string;
}

export function ContentSectionPage({
  sectionKey,
  fallbackTitle,
  fallbackSubtitle,
}: ContentSectionPageProps) {
  const { config, loading } = useSiteConfig();
  const section: ContentSection | undefined = config?.[sectionKey];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-vous-warm-white">
        <span className="inline-block w-6 h-6 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!section?.isActive) {
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

  return (
    <main className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-vous-gray hover:text-vous-gold transition-colors mb-10"
        >
          <ArrowLeft size={12} /> Volver al inicio
        </Link>

        <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-4 block">
          {section.subtitle || fallbackSubtitle}
        </span>
        <h1 className="font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.08] text-vous-soft-black mb-8">
          {section.title || fallbackTitle}
        </h1>

        {section.imageUrl && (
          <div className="w-full aspect-[21/9] overflow-hidden bg-vous-surface mb-10">
            <img
              src={section.imageUrl}
              alt={section.title || fallbackTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className="content-section max-w-3xl font-sans text-vous-gray leading-relaxed [&_strong]:font-semibold [&_strong]:text-vous-soft-black [&_em]:italic [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-vous-soft-black [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-vous-soft-black [&_h3]:mt-5 [&_h3]:mb-2 [&_blockquote]:border-l-[3px] [&_blockquote]:border-vous-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-vous-gray [&_a]:text-vous-gold [&_a]:underline [&_li]:text-vous-gray [&_li]:mb-1"
          dangerouslySetInnerHTML={{
            __html: section.content || "<p>Contenido en construcción.</p>",
          }}
        />

        {section.linkUrl && (
          <div className="mt-10">
            <a
              href={section.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-vous-soft-black text-white font-nav text-[11px] uppercase tracking-wider hover:bg-vous-gold transition-colors"
            >
              Ver más
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
