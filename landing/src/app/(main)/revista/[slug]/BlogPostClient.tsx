"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useBlogPost } from "@/hooks/useBlogPost";
import { ArrowLeft } from "lucide-react";
import { proxyCldUrl } from "@/utils/proxyCldUrl";

export function BlogPostClient() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { post, loading, error } = useBlogPost(slug);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-sans text-sm text-black/50">Artículo no encontrado.</p>
        <Link
          href="/revista"
          className="font-nav text-[11px] uppercase tracking-wider text-black hover:underline"
        >
          Volver al blog
        </Link>
      </div>
    );
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <article className="bg-white min-h-screen">
      {/* Hero cover */}
      <div className="relative bg-black overflow-hidden">
        {post.coverImage ? (
          <img
            src={proxyCldUrl(post.coverImage)}
            alt={post.title}
            className="w-full h-auto opacity-80"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#1a1a18] to-[#2a2015]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-20 py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto">
            <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-3">
              {post.category}
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-white leading-snug max-w-3xl">
              {post.title}
            </h1>
            {date && (
              <p className="font-nav text-[10px] tracking-[0.12em] uppercase text-white/60 mt-4">
                {date} &middot; {post.authorName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[720px] mx-auto px-5 md:px-0 py-14 md:py-20">
        <Link
          href="/revista"
          className="inline-flex items-center gap-2 font-nav text-[10px] uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={12} /> Volver al blog
        </Link>

        {post.excerpt && (
          <p className="font-sans text-lg text-black/50 leading-relaxed mb-10 italic">
            {post.excerpt}
          </p>
        )}
        <div
          className="article-content font-sans text-[15px] text-black leading-[1.8]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-black/10">
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-black/50 mb-3">
              Etiquetas
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 border border-black/10 text-black/50 font-nav text-[10px] tracking-wider uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .article-content h2 {
          font-family: serif;
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }
        .article-content p { margin-bottom: 1rem; }
        .article-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .article-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .article-content blockquote {
          border-left: 3px solid #C9A84C;
          padding-left: 1rem;
          font-style: italic;
          color: #666;
          margin-bottom: 1rem;
        }
        .article-content strong { font-weight: 600; }
        .article-content em { font-style: italic; }
      `}</style>
    </article>
  );
}
