"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { NewInBentoGrid } from "./NewInBentoGrid";
import { ShopTheLookGrid } from "./ShopTheLookGrid";

export function NewInSection() {
  const { categories, loading } = useCategories();
  const displayed = categories.slice(0, 3);

  return (
    <section className="bg-vous-warm-white py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-2">
              Últimas Piezas
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black uppercase">
              Nuevas Llegadas
            </h2>
            <p className="font-sans text-sm text-vous-gray mt-2">
              Nuestra última expresión de lujo urbano.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link href="/catalogo">Ver Todo</Link>
          </Button>
        </div>

        {/* Bento Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <div className="col-span-12 md:col-span-7 animate-pulse bg-vous-gray-light/40" />
            <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-6">
              <div className="animate-pulse bg-vous-gray-light/40" />
              <div className="animate-pulse bg-vous-gray-light/40" />
            </div>
          </div>
        )}

        {!loading && <NewInBentoGrid categories={displayed} />}

        <ShopTheLookGrid />

        <div className="mt-10 text-center md:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalogo">Ver Todo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
