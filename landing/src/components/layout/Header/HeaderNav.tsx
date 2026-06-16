import Link from "next/link";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "/", label: "INICIO" },
  { href: "/catalogo", label: "CATÁLOGO" },
  { href: "/categorias", label: "CATEGORÍAS" },
  { href: "/icon", label: "ICON" },
  { href: "/tendencias", label: "TENDENCIAS" },
  { href: "/recomendaciones", label: "RECOMENDACIONES" },
  { href: "/revista", label: "BLOG DE MODA" },
  { href: "/nuevos-posts", label: "NEW POST" },
  { href: "/nosotros", label: "NOSOTROS" },
] as const;

interface HeaderNavProps {
  pathname?: string;
}

export function HeaderNav({ pathname = "/" }: HeaderNavProps) {
  return (
    <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "font-sans text-[11px] font-medium tracking-widest uppercase transition-colors duration-200 py-1",
            pathname === href
              ? "text-black border-b border-black pb-0.5"
              : "text-black/60 hover:text-black"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export { NAV_LINKS };
