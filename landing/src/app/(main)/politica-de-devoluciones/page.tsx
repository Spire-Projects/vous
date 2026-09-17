import type { Metadata } from "next";
import { PoliticaDevolucionesPage } from "./PoliticaDevolucionesPage";

export const metadata: Metadata = {
  title: "Política de Devoluciones | VOUS",
  description:
    "Conocé nuestras políticas de devolución, cambios y reembolsos para tus compras en VOUS.",
};

export default function Page() {
  return <PoliticaDevolucionesPage />;
}
