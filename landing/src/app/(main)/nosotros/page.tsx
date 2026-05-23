import type { Metadata } from "next";
import {
  AboutHero,
  AboutHistory,
  AboutValues,
  AboutContact,
  AboutCta,
} from "@/components/nosotros";
import { FAQSection } from "@/components/home";

export const metadata: Metadata = {
  title: "Nosotros — VOUS Luxury Urban Fashion",
  description:
    "Conoce la historia, los valores y la esencia de VOUS. Moda urbana contemporánea con identidad latinoamericana.",
};

export default function NosotrosPage() {
  return (
    <>
      <AboutHero />
      <AboutHistory />
      <AboutValues />
      <AboutContact />
      <FAQSection />
      <AboutCta />
    </>
  );
}
