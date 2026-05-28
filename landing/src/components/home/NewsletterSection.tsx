"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  }

  return (
    <section className="py-20 md:py-28 bg-vous-soft-black text-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 uppercase">
            Acceso Privilegiado
          </h2>
          <p className="font-sans text-base text-white/70 max-w-md leading-relaxed">
            Únete a nuestro círculo exclusivo para acceso anticipado a
            lanzamientos limitados y contenido editorial.
          </p>
        </div>
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="flex border-b border-white/50 pb-2 focus-within:border-vous-gold transition-colors"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="TU CORREO ELECTRÓNICO"
              className="bg-transparent border-none outline-none w-full font-nav text-[12px] font-semibold tracking-[0.15em] text-white placeholder-white/50 uppercase py-1"
            />
            <button
              type="submit"
              className="font-nav text-[12px] font-semibold tracking-[0.15em] text-white hover:text-vous-gold transition-colors uppercase shrink-0"
            >
              UNIRSE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
