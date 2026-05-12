import Link from "next/link";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "/", label: "INICIO" },
  { href: "/catalogo", label: "CATÁLOGO" },
  { href: "/categorias", label: "CATEGORÍAS" },
  { href: "/revista", label: "REVISTA" },
  { href: "/mayoristas", label: "MAYORISTAS" },
] as const;

interface HeaderNavProps {
  pathname?: string;
}

export function HeaderNav({ pathname = "/" }: HeaderNavProps) {
  return (
    <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "font-sans text-[13px] font-medium tracking-[0.15em] transition-colors duration-200",
            pathname === href
              ? "text-vous-gold border-b border-vous-gold pb-0.5"
              : "text-vous-soft-black hover:text-vous-gold"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export { NAV_LINKS };
