import type { Metadata } from "next";
import { TerminosPage } from "./TerminosPage";

export const metadata: Metadata = {
  title: "Términos y Condiciones | VOUS",
  description:
    "Términos y condiciones de uso de la plataforma VOUS. Conocé tus derechos y obligaciones como usuario.",
};

export default function Page() {
  return <TerminosPage />;
}
