import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { firestoreBlogPostRepository } from "@/infrastructure/repositories/firestore-blog-post.repository";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolved = await Promise.resolve(props.params);
  const slug = resolved.slug;

  let post: BlogPost | null = null;
  try {
    post = await firestoreBlogPostRepository.findBySlug(slug);
  } catch {
    // ignore
  }

  if (!post) {
    return {
      title: "Artículo no encontrado | Revista VOUS",
    };
  }

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolved = await Promise.resolve(props.params);
  const slug = resolved.slug;

  let post: BlogPost | null = null;
  try {
    post = await firestoreBlogPostRepository.findBySlug(slug);
  } catch {
    // ignore
  }

  if (!post) {
    return notFound();
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <article className="bg-vous-warm-white min-h-screen">
      {/* Hero cover */}
      <div className="relative aspect-[21/9] md:aspect-[21/7] bg-vous-soft-black overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a18] to-[#2a2015]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-20 py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto">
            <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-gold mb-3">
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
        {post.excerpt && (
          <p className="font-sans text-lg text-vous-gray leading-relaxed mb-10 italic">
            {post.excerpt}
          </p>
        )}
        <div
          className="article-content font-sans text-[15px] text-vous-soft-black leading-[1.8]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-vous-gray-light/40">
            <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-3">
              Etiquetas
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 border border-vous-gray-light text-vous-gray font-nav text-[10px] tracking-wider uppercase"
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
        .article-content p {
          margin-bottom: 1rem;
        }
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
        .article-content strong {
          font-weight: 600;
        }
        .article-content em {
          font-style: italic;
        }
      `}</style>
    </article>
  );
}
