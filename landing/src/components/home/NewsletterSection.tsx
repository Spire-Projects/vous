"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend / newsletter service
    setEmail("");
  };

  return (
    <section className="bg-vous-soft-black py-20 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-white uppercase mb-4">
            Acceso Privilegiado
          </h2>
          <p className="font-sans text-base text-vous-gray-light max-w-md">
            Únete a nuestro círculo exclusivo para acceso anticipado a lanzamientos limitados y
            contenido editorial.
          </p>
        </div>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex border-b border-white pb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="TU CORREO ELECTRÓNICO"
              className="bg-transparent border-none focus:ring-0 w-full font-nav text-[12px] tracking-[0.15em] text-white placeholder-white/50 px-0 outline-none"
              required
            />
            <button
              type="submit"
              className="font-nav text-[11px] font-semibold tracking-[0.2em] text-white hover:text-vous-gold transition-colors uppercase shrink-0"
            >
              UNIRSE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
