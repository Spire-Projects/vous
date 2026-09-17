import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo Mayorista | VOUS",
  description: "Catálogo exclusivo para clientes mayoristas aprobados de VOUS.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function MayoristasCatalogoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
