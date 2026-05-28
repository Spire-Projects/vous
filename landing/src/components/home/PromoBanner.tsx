import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="bg-vous-gold-dark text-white py-3 text-center">
      <p className="font-nav text-[10px] md:text-[11px] font-semibold tracking-[0.3em] uppercase">
        OFERTAS DE TEMPORADA:{" "}
        <span className="text-vous-gold-light font-bold">20% OFF</span> EN
        SELECCIÓN EXCLUSIVA —{" "}
        <Link
          href="/catalogo?descuento=1"
          className="underline underline-offset-4 hover:text-vous-gold transition-colors"
        >
          COMPRAR AHORA
        </Link>
      </p>
    </div>
  );
}
