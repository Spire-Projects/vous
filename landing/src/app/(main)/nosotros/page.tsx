import type { Metadata } from "next";
import { NosotrosPage } from "./NosotrosPage";

export const metadata: Metadata = {
  title: "Nosotros | VOUS",
  description:
    "Conocé la esencia de VOUS: lujo urbano, exclusividad y estilo contemporáneo. Nuestra historia, valores y filosofía.",
};

export default function Page() {
  return <NosotrosPage />;
}
