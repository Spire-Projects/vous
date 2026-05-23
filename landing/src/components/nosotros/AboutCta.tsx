import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section className="bg-vous-warm-white px-5 md:px-20 py-20 md:py-28 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-[42px] font-medium text-vous-soft-black leading-[1.2] mb-6 italic">
          &ldquo;El estilo es la respuesta a todo.&rdquo;
        </h2>
        <p className="font-sans text-base text-vous-gray mb-10">
          Descubre nuestra última colección inspirada en el minimalismo urbano.
        </p>
        <Button variant="default" size="lg" asChild>
          <Link href="/catalogo">Explorar Colección</Link>
        </Button>
      </div>
    </section>
  );
}
