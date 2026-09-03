"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { FAQSection } from "@/app/(main)/nosotros/FAQSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Diamond,
  Users,
  Sparkles,
  Heart,
  BadgeCheck,
  Handshake,
  Crown,
  Infinity as InfinityIcon,
} from "lucide-react";
import { NosotrosHistoria, NosotrosPilares, NosotrosScheduleContact } from "@/components/nosotros";

const NosotrosMap = dynamic(
  () => import("@/components/nosotros/NosotrosMap").then((mod) => mod.NosotrosMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-white animate-pulse rounded-2xl flex items-center justify-center">
        <span className="font-nav text-[11px] uppercase tracking-[0.2em] text-black/50">
          Cargando mapa...
        </span>
      </div>
    ),
  }
);

const VALORES = [
  {
    icon: Diamond,
    title: "Exclusividad",
    desc: "Cuidamos cada detalle de nuestros diseños, distribución y experiencia para mantener la esencia única de VOUS.",
  },
  {
    icon: Users,
    title: "Comunidad",
    desc: "Más que clientes, buscamos construir una comunidad donde cada persona se sienta parte del Team VOUS.",
  },
  {
    icon: Sparkles,
    title: "Autenticidad",
    desc: "Creemos en la belleza de lo real y en la individualidad que hace única a cada persona.",
  },
  {
    icon: Crown,
    title: "Estilo",
    desc: "Promovemos la libertad de expresión a través de la moda y las tendencias contemporáneas.",
  },
  {
    icon: Heart,
    title: "Inclusión",
    desc: "Creemos en la moda para todos, con opciones de tallas ampliadas y para chicas y chicos.",
  },
  {
    icon: BadgeCheck,
    title: "Calidad",
    desc: "Trabajamos con los mejores materiales y procesos para ofrecer productos que superen expectativas.",
  },
  {
    icon: Handshake,
    title: "Compromiso",
    desc: "Actuamos con responsabilidad, pasión y dedicación en cada proceso, trabajando siempre para mejorar y crecer.",
  },
  {
    icon: InfinityIcon,
    title: "Libertad",
    desc: "Diseñamos para quienes rompen moldes, crean su propia esencia y se expresan sin reglas.",
  },
];

export function NosotrosPage() {
  const { config } = useSiteConfig();

  const storeName = config?.storeName ?? "VOUS";
  const whatsappNumber = config?.whatsappNumber ?? "";
  const whatsappMessage = config?.whatsappMessage ?? "";
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);
  const departmentLinks = config?.departmentLinks ?? [];
  const otherCountryLinks = config?.otherCountryLinks ?? [];

  return (
    <div className="bg-white">
      {/* Editorial Hero con imagen principal */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/vous-about-2.png"
            alt="VOUS - Tú nos inspiras"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20 py-24 md:py-40">
          <div className="max-w-3xl">
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-5 block">
              Nuestra Esencia
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] mb-6">
              Tú nos inspiras
            </h1>
            <p className="font-sans text-base md:text-lg text-white/80 max-w-xl leading-relaxed mb-8">
              No seguimos reglas. Creamos esencia. {storeName} nace para quienes rompen moldes y
              construyen su propio estilo.
            </p>
            <div className="flex flex-wrap items-center gap-3 font-nav text-[10px] tracking-[0.3em] uppercase text-white/70">
              <span>Estilo</span>
              <span className="text-[#C9A84C]">|</span>
              <span>Autenticidad</span>
              <span className="text-[#C9A84C]">|</span>
              <span>Comunidad</span>
              <span className="text-[#C9A84C]">|</span>
              <span>Exclusividad</span>
              <span className="text-[#C9A84C]">|</span>
              <span>Libertad</span>
            </div>
          </div>
        </div>
      </section>

      {/* Manifiesto + imagen about-1 */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0d0d0b] shadow-2xl">
                <Image
                  src="/vous-about.png"
                  alt="Misión, Visión y Valores VOUS"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-10">
              <div>
                <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-3 block">
                  Manifiesto
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-black leading-[1.05] mb-5">
                  La perfección nunca nos inspiró. Nos inspira lo real.
                </h2>
                <p className="font-sans text-base text-black/60 leading-relaxed max-w-xl">
                  {storeName} nace para quienes rompen moldes y crean su propia esencia. Somos una
                  marca de moda urbana contemporánea pensada para Bolivia y Latinoamérica,
                  construida sobre exclusividad, comunidad y autenticidad.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-black/10">
                <div>
                  <p className="font-nav text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-2">
                    Misión
                  </p>
                  <p className="font-sans text-sm text-black/70 leading-relaxed">
                    Crear una experiencia de moda auténtica, exclusiva y cercana, ofreciendo prendas
                    que permitan a cada persona expresar su estilo con seguridad.
                  </p>
                </div>
                <div>
                  <p className="font-nav text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-2">
                    Visión
                  </p>
                  <p className="font-sans text-sm text-black/70 leading-relaxed">
                    Convertirnos en una marca referente de moda urbana y contemporánea en Bolivia y
                    Latinoamérica, destacando por nuestra exclusividad, innovación e inclusión.
                  </p>
                </div>
                <div>
                  <p className="font-nav text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-2">
                    Propósito
                  </p>
                  <p className="font-sans text-sm text-black/70 leading-relaxed">
                    Inspirar a las personas a ser su mejor versión a través de la moda, promoviendo
                    la autenticidad, la libertad y la confianza en quienes son.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-[#FAF8F5] py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-nav text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-3 block">
              Nuestros Valores
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-black">Lo que nos define</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALORES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mb-4">
                  <Icon size={18} strokeWidth={1.5} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-nav text-[11px] font-semibold tracking-[0.2em] uppercase text-black mb-2">
                  {title}
                </h3>
                <p className="font-sans text-xs text-black/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF8F5]">
        <NosotrosHistoria storeName={storeName} />
      </section>
      <section className="bg-white">
        <NosotrosPilares />
      </section>
      <section className="bg-[#FAF8F5]">
        <NosotrosScheduleContact config={config} whatsappHref={whatsappHref} />
      </section>
      <section className="bg-white border-y border-black/10 py-12 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="mb-14 text-center">
            <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-3 block">
              Puntos Oficiales
            </span>
            <h2 className="font-serif text-[28px] md:text-[42px] text-black">
              Encuentra tu tienda más cercana
            </h2>
            <p className="font-sans text-sm text-black/50 mt-3">
              Selecciona un departamento en el mapa para ver los puntos de venta oficiales.
            </p>
          </div>
          <div className="relative z-0">
            <NosotrosMap departmentLinks={departmentLinks} otherCountryLinks={otherCountryLinks} />
          </div>
        </div>
      </section>
      <section className="bg-[#FAF8F5]">
        <FAQSection />
      </section>

      {/* Editorial CTA al catálogo */}
      <section className="relative bg-black text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/20 blur-3xl" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-nav text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-5 block">
              El estilo es la respuesta
            </span>
            <h2 className="font-serif text-3xl md:text-5xl italic leading-tight mb-6">
              &ldquo;El estilo es la respuesta a todo.&rdquo;
            </h2>
            <p className="font-sans text-sm md:text-base text-white/60 mb-10">
              Descubrí nuestra última colección inspirada en el minimalismo industrial.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-nav text-[11px] uppercase tracking-[0.3em]"
            >
              <Link href="/catalogo">
                Explorar catálogo <ArrowRight size={14} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
