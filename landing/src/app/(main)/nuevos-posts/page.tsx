import { ContentSectionPage } from "@/components/content/ContentSectionPage";

export const metadata = {
  title: "Nuevos Posts | VOUS",
  description: "Nuestros últimos videos y posts en redes sociales.",
};

export default function NuevosPostsPage() {
  return (
    <ContentSectionPage
      sectionKey="newPosts"
      fallbackTitle="New Post"
      fallbackSubtitle="Nuestros últimos posts"
    />
  );
}
