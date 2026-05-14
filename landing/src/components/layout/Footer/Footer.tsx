import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { FooterLinks } from "./FooterLinks";
import { FooterSocial } from "./FooterSocial";

const WHATSAPP_HREF =
  "https://api.whatsapp.com/send?phone=59165359595&text=%E2%9C%A8%20Hola%2C%20soy%20*Luana*%2C%20tu%20asesora%20de%20moda%20%F0%9F%A4%8D%0A%0AEstoy%20aqu%C3%AD%20para%20ayudarte%20a%20encontrar%20tu%20outfit%20ideal%20%F0%9F%92%AB%0A%0APuedes%20escribirme%20por%3A%0A%F0%9F%91%97%20Modelos%20disponibles%0A%F0%9F%93%8F%20Tallas%0A%F0%9F%92%B0%20Precios%0A%F0%9F%9A%9A%20Env%C3%ADos%0A%F0%9F%9B%8D%EF%B8%8F%20Pedidos%0A%0ATambi%C3%A9n%20puedes%20enviarme%20una%20foto%20del%20modelo%20que%20te%20guste%20%F0%9F%92%95%0A%0A%E2%9C%A8%20Stock%20limitado%0A%0A";

const MAPS_HREF =
  "https://www.google.com/maps/place/C.+Esteban+Arze+1355-1313,+Cochabamba/@-17.4035481,-66.1557096,875m/data=!3m2!1e3!4b1!4m6!3m5!1s0x93e373efaf042501:0x466fbf44a8ef72db!8m2!3d-17.4035481!4d-66.1557096!16s%2Fg%2F11wbgzbzsc";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-vous-soft-black text-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 mb-12">
          {/* Brand */}
          <div className="space-y-4 max-w-[240px]">
            <Link
              href="/"
              className="font-serif text-3xl font-bold tracking-[0.08em] text-white hover:text-vous-gold transition-colors"
            >
              VOUS
            </Link>
            <p className="font-sans text-sm text-vous-gray-light leading-relaxed">
              Moda urbana contemporánea. Exclusividad, estilo y autenticidad en cada pieza.
            </p>
            <a
              href="mailto:hola@vous.com.bo"
              className="inline-flex items-center gap-2 font-sans text-sm text-vous-gold hover:text-vous-gold-light transition-colors"
            >
              <Mail size={14} />
              hola@vous.com.bo
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-vous-gray-light hover:text-white transition-colors"
            >
              <MessageCircle size={14} />
              Luana — Asesora de moda
            </a>
            <a
              href={MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-vous-gray-light hover:text-white transition-colors"
            >
              <MapPin size={14} />
              C. Esteban Arze 1355, Cochabamba
            </a>
            <FooterSocial />
          </div>

          {/* Links */}
          <FooterLinks />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[12px] text-vous-gray tracking-wide">
            © {year} VOUS. Todos los derechos reservados.
          </p>
          <p className="font-sans text-[11px] text-vous-gray tracking-[0.1em]">
            BOLIVIA · LATINOAMÉRICA
          </p>
        </div>
      </div>
    </footer>
  );
}
