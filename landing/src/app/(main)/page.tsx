import {
  HeroSection,
  ValuesSection,
  NewInSection,
  CollectionsSection,
  FeaturedProductsSection,
  SocialPostsSection,
  FeedbackSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuesSection />
      <FeaturedProductsSection />
      <CollectionsSection />
      <NewInSection />
      <SocialPostsSection />
      <FeedbackSection />
    </>
  );
}
