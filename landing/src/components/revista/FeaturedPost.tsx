import Link from "next/link";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/revista/${post.slug}`} className="group md:flex gap-10 mb-16 block">
      <div className="md:w-1/2 overflow-hidden bg-black relative shrink-0 mb-6 md:mb-0">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full aspect-video bg-black" />
        )}
      </div>
      <div className="md:w-1/2 flex flex-col justify-center">
        <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-2">
          {post.category}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-black leading-snug mb-4 group-hover:text-black transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-sans text-sm text-black/50 leading-relaxed mb-6">{post.excerpt}</p>
        )}
        <p className="font-nav text-[10px] tracking-[0.12em] uppercase text-black/50">{date}</p>
      </div>
    </Link>
  );
}
