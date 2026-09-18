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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)] space-y-6">
      <PageHeader
        category="Contenido"
        title="Contenido Editorial"
        subtitle="Gestión de contenido editorial, influencers y publicaciones destacadas."
      />

      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("blog")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "blog"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText size={15} strokeWidth={2} />
          Blog / Revista
        </button>
        <button
          onClick={() => setActiveTab("icon")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "icon"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Star size={15} strokeWidth={2} />
          ICON
        </button>
        <button
          onClick={() => setActiveTab("new-posts")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === "new-posts"
              ? "bg-white text-slate-900 font-semibold shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Video size={15} strokeWidth={2} />
          New Post
        </button>
      </div>

      {activeTab === "blog" && <BlogTab />}
      {activeTab === "icon" && <IconTab />}
      {activeTab === "new-posts" && <NewPostsTab />}
    </div>
  );
}
