import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

interface HeroTextProps {
  banner: Banner;
}

export function HeroText({ banner }: HeroTextProps) {
  const [mainTitle, accentTitle] = banner.title.split("\n");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={banner.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <p className="font-nav text-[11px] font-semibold tracking-[0.5em] text-vous-gold uppercase">
          ESTILO | AUTENTICIDAD | EXCLUSIVIDAD
        </p>

        <h1 className="font-serif text-[clamp(3rem,6vw,5rem)] font-bold text-vous-soft-black leading-[1.0] tracking-[-0.02em]">
          {mainTitle}
          {accentTitle && (
            <>
              <br />
              <span
                className="italic font-normal"
                style={{
                  background: "linear-gradient(135deg, #D9BB96 0%, #A87B42 50%, #D9BB96 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {accentTitle}
              </span>
            </>
          )}
        </h1>

        <p className="font-sans text-base text-vous-gray max-w-md leading-relaxed">
          {banner.subtitle}
        </p>

        <div className="flex items-center gap-4 flex-wrap pt-2">
          <Link
            href={banner.ctaUrl || "/catalogo"}
            className="bg-vous-soft-black text-white px-10 py-4 font-nav text-[13px] font-medium tracking-[0.15em] uppercase hover:bg-vous-gold transition-all duration-500"
          >
            {banner.ctaText || "VER TODO"}
          </Link>
          <Link
            href="/catalogo"
            className="border border-vous-soft-black text-vous-soft-black px-10 py-4 font-nav text-[13px] font-medium tracking-[0.15em] uppercase hover:bg-vous-soft-black hover:text-white transition-all duration-500"
          >
            EXPLORAR
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
