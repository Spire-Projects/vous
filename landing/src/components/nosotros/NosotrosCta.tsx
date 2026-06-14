import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NosotrosCta() {
  return (
    <section className="max-w-3xl mx-auto px-5 md:px-20 py-16 md:py-28 text-center">
      <h2 className="font-serif text-2xl md:text-4xl text-black italic mb-6 leading-tight">
        &ldquo;El estilo es la respuesta a todo.&rdquo;
      </h2>
      <p className="font-sans text-sm md:text-base text-black/50 mb-10">
        Descubrí nuestra última colección inspirada en el minimalismo industrial.
      </p>
      <Button asChild size="lg" className="tracking-[0.3em]">
        <Link href="/catalogo">Explorar Colección</Link>
      </Button>
    </section>
  );
}
