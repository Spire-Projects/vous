import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Navegación",
    links: [
      { href: "/", label: "Inicio" },
      { href: "/catalogo", label: "Catálogo" },
      { href: "/categorias", label: "Categorías" },
      { href: "/revista", label: "Revista" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/contacto", label: "Contacto" },
      { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
      { href: "/politica-de-envios", label: "Política de Envíos" },
      { href: "/terminos", label: "Términos y Condiciones" },
    ],
  },
  {
    title: "Mayoristas",
    links: [
      { href: "/mayoristas", label: "Portal Mayoristas" },
      { href: "/mayoristas/registro", label: "Crear Cuenta B2B" },
      { href: "/mayoristas/catalogo", label: "Catálogo Mayoreo" },
    ],
  },
] as const;

export function FooterLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
      {FOOTER_SECTIONS.map(({ title, links }) => (
        <div key={title}>
          <h3 className="font-sans text-[11px] font-semibold tracking-[0.2em] text-vous-gold uppercase mb-4">
            {title}
          </h3>
          <ul className="space-y-2.5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-vous-gray-light hover:text-white transition-colors duration-200"
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
