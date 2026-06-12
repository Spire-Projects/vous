import { ContentSectionPage } from "@/components/content/ContentSectionPage";

export const metadata = {
  title: "VOUS News | Revista Digital de Moda",
  description: "La revista digital de VOUS: eventos de moda, pasarelas y todo lo relacionado con la moda urbana.",
};

export default function VousNewsPage() {
  return (
    <ContentSectionPage
      sectionKey="vousNews"
      fallbackTitle="VOUS News"
      fallbackSubtitle="Revista digital de moda"
    />
  );
}
