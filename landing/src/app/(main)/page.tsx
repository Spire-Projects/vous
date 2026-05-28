import {
  HeroSection,
  ValuesSection,
  NewInSection,
  ShopTheLookSection,
  CollectionsSection,
  NewsletterSection,
  FeaturedProductsSection,
} from "@/components/home";
import { getActiveLandingSections } from "@/application/use-cases/landing-section/get-active-landing-sections";
import { firestoreLandingSectionRepository } from "@/infrastructure";

import type { LandingSectionWithProducts } from "@/domain/repositories/landing-section.repository";

export const revalidate = 60;

export default async function HomePage() {
  let sections: LandingSectionWithProducts[] = [];
  try {
    sections = await getActiveLandingSections(
      firestoreLandingSectionRepository
    );
  } catch {
    sections = [];
  }

  return (
    <>
      <HeroSection />
      <ValuesSection />
      {sections.length > 0 && <FeaturedProductsSection sections={sections} />}
      <NewInSection />
      <ShopTheLookSection />
      <CollectionsSection />
      <NewsletterSection />
    </>
  );
}
