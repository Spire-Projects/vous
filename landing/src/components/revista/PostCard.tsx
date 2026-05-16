import Link from "next/link";
import Image from "next/image";
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
      <div className="aspect-video overflow-hidden bg-vous-soft-black mb-4 relative">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3d3d38] to-[#1a1a18]" />
        )}
      </div>
      <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-gold mb-2">
        {post.category}
      </p>
      <h3 className="font-serif text-lg text-vous-soft-black group-hover:text-vous-gold transition-colors leading-snug mb-3">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="font-sans text-xs text-vous-gray leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <p className="font-nav text-[10px] tracking-[0.12em] uppercase text-vous-gray">{date}</p>
    </Link>
  );
}
