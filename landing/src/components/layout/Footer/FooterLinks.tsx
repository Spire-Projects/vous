import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Navegación",
    links: [
      { href: "/", label: "Inicio" },
      { href: "/catalogo", label: "Catálogo" },
      { href: "/categorias", label: "Categorías" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/asesoria-de-moda", label: "Asesoría de Moda" },
      { href: "/recomendaciones", label: "Recomendaciones" },
      { href: "/revista", label: "Blog de Moda" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/politica-de-envios", label: "Política de Envíos" },
      { href: "/politica-de-devoluciones", label: "Política de Devoluciones" },
      { href: "/terminos", label: "Términos y Condiciones" },
    ],
  },
  {
    title: "Mayoristas",
    links: [
      { href: "/mayoristas", label: "Portal Mayoristas" },
      { href: "/mayoristas/catalogo", label: "Catálogo Mayoreo" },
    ],
  },
] as const;

export function FooterLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
      {FOOTER_SECTIONS.map(({ title, links }) => (
        <div key={title}>
          <h3 className="font-sans text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
            {title}
          </h3>
          <ul className="space-y-2.5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
