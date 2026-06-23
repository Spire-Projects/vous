import {
  HeroSection,
  ValuesSection,
  NewInSection,
  CollectionsSection,
  FeaturedProductsSection,
  TrendingProductsSection,
  FeedbackSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuesSection />
      <FeaturedProductsSection />
      <TrendingProductsSection />
      <CollectionsSection />
      <NewInSection />
      <FeedbackSection />
    </>
  );
}
