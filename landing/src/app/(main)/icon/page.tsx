import type { Metadata } from "next";
import { IconPage } from "./IconPage";

export const metadata: Metadata = {
  title: "VOUS ICON | Inspo Outfits",
  description:
    "Descubre los outfits que nuestros influencers crean con VOUS. Síguelos para más inspiración de estilo.",
};

export default function Page() {
  return <IconPage />;
}
