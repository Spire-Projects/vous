import { useState } from "react";
import { FileText, Star, Video } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogTab } from "@/components/content/BlogTab";
import { IconTab } from "@/components/content/IconTab";
import { NewPostsTab } from "@/components/content/NewPostsTab";

type ContentTab = "blog" | "icon" | "new-posts";

export function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>("blog");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Contenido"
        subtitle="Gestión de contenido editorial, influencers y redes sociales."
      />

      <div className="flex gap-1 border-b border-white/40 pb-1">
        <button
          onClick={() => setActiveTab("blog")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "blog"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <FileText size={14} strokeWidth={1.5} />
          Blog / Revista
        </button>
        <button
          onClick={() => setActiveTab("icon")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "icon"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Star size={14} strokeWidth={1.5} />
          ICON
        </button>
        <button
          onClick={() => setActiveTab("new-posts")}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] sm:text-sm font-sans border-b-2 transition-colors -mb-[1px] rounded-t-lg ${
            activeTab === "new-posts"
              ? "border-vous-gold text-vous-gold font-semibold bg-amber-50/60"
              : "border-transparent text-vous-text-secondary hover:text-vous-text hover:bg-white/40"
          }`}
        >
          <Video size={14} strokeWidth={1.5} />
          New Post
        </button>
      </div>

      {activeTab === "blog" && <BlogTab />}
      {activeTab === "icon" && <IconTab />}
      {activeTab === "new-posts" && <NewPostsTab />}
    </div>
  );
}
