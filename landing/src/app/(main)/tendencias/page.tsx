import { ContentSectionPage } from "@/components/content/ContentSectionPage";

export const metadata = {
  title: "Tendencias de Moda | VOUS",
  description: "Descubre las prendas que están de moda esta temporada en VOUS.",
};

export default function TendenciasPage() {
  return (
    <ContentSectionPage
      sectionKey="fashionTrends"
      fallbackTitle="Fashion Trends"
      fallbackSubtitle="Tendencias de la temporada"
    />
  );
}
