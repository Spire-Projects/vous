import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link
      href="/"
      className="font-serif text-2xl font-bold tracking-[0.08em] text-vous-soft-black hover:text-vous-gold transition-colors duration-200"
      aria-label="VOUS — Inicio"
    >
      VOUS
    </Link>
  );
}
