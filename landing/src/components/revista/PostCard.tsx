import Link from "next/link";
import type { BlogPost } from "@/domain/entities/blog-post.entity";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/revista/${post.slug}`} className="group block">
      <div className="overflow-hidden bg-black mb-4 relative">
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
      <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-2">
        {post.category}
      </p>
      <h3 className="font-serif text-lg text-black group-hover:text-black transition-colors leading-snug mb-3">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="font-sans text-xs text-black/50 leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <p className="font-nav text-[10px] tracking-[0.12em] uppercase text-black/50">{date}</p>
    </Link>
  );
}
