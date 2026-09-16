import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

interface BannerPreviewProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaVisible?: boolean;
}

export function BannerPreview({
  title,
  subtitle,
  imageUrl,
  ctaText = "Ver Todo",
  ctaVisible = true,
}: BannerPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const displayTitle = title.trim() || "TÍTULO DEL BANNER";
  const displaySubtitle =
    subtitle.trim() || "Subtítulo descriptivo de la colección o campaña.";
  const displayCta = ctaText.trim() || "VER TODO";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-nav text-[10px] uppercase tracking-wider text-vous-text-secondary">
          Vista previa en vivo
        </span>
        <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded border border-vous-border">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-nav rounded transition-colors ${
              device === "desktop"
                ? "bg-white text-vous-text shadow-xs font-medium"
                : "text-vous-text-secondary hover:text-vous-text"
            }`}
          >
            <Monitor size={12} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-nav rounded transition-colors ${
              device === "mobile"
                ? "bg-white text-vous-text shadow-xs font-medium"
                : "text-vous-text-secondary hover:text-vous-text"
            }`}
          >
            <Smartphone size={12} /> Mobile
          </button>
        </div>
      </div>

      <div
        className={`mx-auto transition-all duration-300 border border-vous-border overflow-hidden bg-vous-black relative ${
          device === "mobile"
            ? "max-w-[320px] aspect-[4/5]"
            : "w-full aspect-[16/9]"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3d2e15] via-[#2a2015] to-[#0d0d0b]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end text-left z-10">
          <span className="font-nav text-[8px] md:text-[10px] font-semibold tracking-[0.2em] text-vous-gold uppercase border border-vous-gold/40 px-2 py-0.5 self-start mb-2">
            ESTILO | AUTENTICIDAD | EXCLUSIVIDAD
          </span>
          <h2 className="font-serif text-lg md:text-2xl font-bold text-white leading-tight mb-1.5 uppercase line-clamp-2">
            {displayTitle}
          </h2>
          <p className="font-sans text-xs md:text-sm text-white/80 line-clamp-2 mb-4 max-w-md">
            {displaySubtitle}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {ctaVisible ? (
              <span className="bg-vous-gold text-vous-black font-nav text-[10px] md:text-[11px] font-semibold px-3 py-1.5 uppercase tracking-wider shadow-sm">
                {displayCta}
              </span>
            ) : (
              <span className="text-[10px] text-white/40 italic font-sans border border-white/20 px-2 py-0.5">
                (Botón CTA desactivado)
              </span>
            )}
            <span className="border border-white/40 text-white font-nav text-[10px] md:text-[11px] px-3 py-1.5 uppercase tracking-wider">
              EXPLORAR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
