"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: conectar con servicio de email / Firestore
    setSent(true);
  };

  return (
    <section className="bg-vous-soft-black py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 text-center">
        <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-4">
          Círculo Privilegiado
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-white mb-4 leading-tight">
          Acceso Privilegiado
        </h2>
        <p className="font-sans text-sm text-white/60 max-w-md mx-auto mb-10 leading-relaxed">
          Únete a nuestro círculo exclusivo para acceso anticipado a lanzamientos
          limitados y contenido editorial.
        </p>

        {sent ? (
          <p className="font-sans text-sm text-vous-gold tracking-wide">
            ¡Gracias! Te avisaremos con cada lanzamiento exclusivo.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 border-white/20 text-white placeholder:text-white/30 focus:border-vous-gold bg-transparent"
              aria-label="Correo electrónico"
            />
            <Button type="submit" variant="gold" size="default" className="gap-2 whitespace-nowrap">
              UNIRSE <ArrowRight size={14} />
            </Button>
          </form>
        )}

        <p className="font-nav text-[11px] text-white/30 tracking-[0.1em] mt-12 uppercase">
          VOUS Urban Luxury · Redefiniendo el paisaje urbano a través de la artesanía editorial.
        </p>
      </div>
    </section>
  );
}
