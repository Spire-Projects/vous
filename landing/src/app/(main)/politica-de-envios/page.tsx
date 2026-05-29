import type { Metadata } from "next";
import { PoliticaEnviosPage } from "./PoliticaEnviosPage";

export const metadata: Metadata = {
  title: "Política de Envíos | VOUS",
  description:
    "Conocé nuestras políticas de envío, plazos de entrega y zonas de cobertura para tus pedidos en VOUS.",
};

export default function Page() {
  return <PoliticaEnviosPage />;
}
