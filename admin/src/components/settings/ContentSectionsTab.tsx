import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import type { ContentSection, FeedbackSection } from "@/domain/entities/site-config.entity";

interface ContentSectionsTabProps {
  fashionTrends: ContentSection; setFashionTrends: (v: ContentSection) => void;
  vousNews: ContentSection; setVousNews: (v: ContentSection) => void;
  newPosts: ContentSection; setNewPosts: (v: ContentSection) => void;
  feedback: FeedbackSection; setFeedback: (v: FeedbackSection) => void;
}

function SectionCard({
  title,
  open: initialOpen,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen ?? true);
  return (
    <div className="border border-vous-border rounded-2xl bg-white/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/40 transition-colors"
      >
        <h3 className="font-serif text-lg text-vous-text">{title}</h3>
        <ChevronDown
          size={18}
          className={`text-vous-text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

export function ContentSectionsTab({
  fashionTrends, setFashionTrends,
  vousNews, setVousNews,
  newPosts, setNewPosts,
  feedback, setFeedback,
}: ContentSectionsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Secciones de Contenido</h2>
      <p className="text-sm text-vous-text-secondary font-sans">
        Activa y configura las secciones adicionales que aparecen en la landing page.
      </p>

      <div className="space-y-4">
        {/* FASHION TRENDS */}
        <SectionCard title="FASHION TRENDS">
          <div className="flex items-center gap-3">
            <Checkbox
              id="fashion-trends-active"
              checked={fashionTrends.isActive}
              onCheckedChange={(v) => setFashionTrends({ ...fashionTrends, isActive: v === true })}
            />
            <Label htmlFor="fashion-trends-active" className="text-sm font-sans">Mostrar sección en la landing</Label>
          </div>
          <div className="space-y-1">
            <Label>Título</Label>
            <Input
              value={fashionTrends.title}
              onChange={(e) => setFashionTrends({ ...fashionTrends, title: e.target.value })}
              placeholder="Ej: Tendencias Primavera 2026"
            />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input
              value={fashionTrends.subtitle}
              onChange={(e) => setFashionTrends({ ...fashionTrends, subtitle: e.target.value })}
              placeholder="Ej: Las prendas que marcan esta temporada"
            />
          </div>
          <div className="space-y-1">
            <Label>Contenido</Label>
            <RichTextEditor
              content={fashionTrends.content}
              onChange={(v) => setFashionTrends({ ...fashionTrends, content: v })}
            />
          </div>
          <div className="space-y-1">
            <Label>URL de imagen principal</Label>
            <Input
              value={fashionTrends.imageUrl ?? ""}
              onChange={(e) => setFashionTrends({ ...fashionTrends, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <Label>Link externo (opcional)</Label>
            <Input
              value={fashionTrends.linkUrl ?? ""}
              onChange={(e) => setFashionTrends({ ...fashionTrends, linkUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </SectionCard>

        {/* VOUS NEWS */}
        <SectionCard title="VOUS NEWS">
          <div className="flex items-center gap-3">
            <Checkbox
              id="vous-news-active"
              checked={vousNews.isActive}
              onCheckedChange={(v) => setVousNews({ ...vousNews, isActive: v === true })}
            />
            <Label htmlFor="vous-news-active" className="text-sm font-sans">Mostrar sección en la landing</Label>
          </div>
          <div className="space-y-1">
            <Label>Título</Label>
            <Input
              value={vousNews.title}
              onChange={(e) => setVousNews({ ...vousNews, title: e.target.value })}
              placeholder="Ej: VOUS News"
            />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input
              value={vousNews.subtitle}
              onChange={(e) => setVousNews({ ...vousNews, subtitle: e.target.value })}
              placeholder="Ej: Tu revista digital de moda urbana"
            />
          </div>
          <div className="space-y-1">
            <Label>Contenido</Label>
            <RichTextEditor
              content={vousNews.content}
              onChange={(v) => setVousNews({ ...vousNews, content: v })}
            />
          </div>
          <div className="space-y-1">
            <Label>URL de imagen principal</Label>
            <Input
              value={vousNews.imageUrl ?? ""}
              onChange={(e) => setVousNews({ ...vousNews, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <Label>Link externo (opcional)</Label>
            <Input
              value={vousNews.linkUrl ?? ""}
              onChange={(e) => setVousNews({ ...vousNews, linkUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </SectionCard>

        {/* NEW POST */}
        <SectionCard title="NEW POST">
          <div className="flex items-center gap-3">
            <Checkbox
              id="new-posts-active"
              checked={newPosts.isActive}
              onCheckedChange={(v) => setNewPosts({ ...newPosts, isActive: v === true })}
            />
            <Label htmlFor="new-posts-active" className="text-sm font-sans">Mostrar sección en la landing</Label>
          </div>
          <div className="space-y-1">
            <Label>Título</Label>
            <Input
              value={newPosts.title}
              onChange={(e) => setNewPosts({ ...newPosts, title: e.target.value })}
              placeholder="Ej: Últimos posts"
            />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input
              value={newPosts.subtitle}
              onChange={(e) => setNewPosts({ ...newPosts, subtitle: e.target.value })}
              placeholder="Ej: Nuestros nuevos videos en redes sociales"
            />
          </div>
          <div className="space-y-1">
            <Label>Contenido</Label>
            <RichTextEditor
              content={newPosts.content}
              onChange={(v) => setNewPosts({ ...newPosts, content: v })}
            />
          </div>
          <div className="space-y-1">
            <Label>URL de imagen principal</Label>
            <Input
              value={newPosts.imageUrl ?? ""}
              onChange={(e) => setNewPosts({ ...newPosts, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <Label>Link externo (opcional)</Label>
            <Input
              value={newPosts.linkUrl ?? ""}
              onChange={(e) => setNewPosts({ ...newPosts, linkUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </SectionCard>

        {/* FEEDBACK */}
        <SectionCard title="QUEJAS O RECOMENDACIONES">
          <div className="flex items-center gap-3">
            <Checkbox
              id="feedback-active"
              checked={feedback.isActive}
              onCheckedChange={(v) => setFeedback({ ...feedback, isActive: v === true })}
            />
            <Label htmlFor="feedback-active" className="text-sm font-sans">Mostrar sección en la landing</Label>
          </div>
          <div className="space-y-1">
            <Label>Título</Label>
            <Input
              value={feedback.title}
              onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
              placeholder="Ej: Quejas o Recomendaciones"
            />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input
              value={feedback.subtitle}
              onChange={(e) => setFeedback({ ...feedback, subtitle: e.target.value })}
              placeholder="Ej: Queremos escucharte"
            />
          </div>
          <div className="space-y-1">
            <Label>Mensaje de confirmación</Label>
            <Input
              value={feedback.successMessage}
              onChange={(e) => setFeedback({ ...feedback, successMessage: e.target.value })}
              placeholder="Gracias por tu mensaje..."
            />
          </div>
          <div className="space-y-1">
            <Label>Email destinatario</Label>
            <Input
              value={feedback.emailRecipient}
              onChange={(e) => setFeedback({ ...feedback, emailRecipient: e.target.value })}
              placeholder="soporte@vous.bo"
              type="email"
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
