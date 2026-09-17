import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactTabProps {
  whatsappNumber: string; setWhatsappNumber: (v: string) => void;
  whatsappMessage: string; setWhatsappMessage: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  googleMapsUrl: string; setGoogleMapsUrl: (v: string) => void;
}

export function ContactTab({
  whatsappNumber, setWhatsappNumber,
  whatsappMessage, setWhatsappMessage,
  email, setEmail,
  address, setAddress,
  city, setCity,
  googleMapsUrl, setGoogleMapsUrl,
}: ContactTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Número de WhatsApp</Label>
          <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="59165359595" />
          <p className="text-[11px] text-vous-text-secondary font-sans">Sin + ni espacios. Ej: 59165359595</p>
        </div>
        <div className="space-y-1">
          <Label>Email de contacto</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hola@vous.com.bo" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Mensaje pre-cargado de WhatsApp</Label>
        <Textarea
          value={whatsappMessage}
          onChange={(e) => setWhatsappMessage(e.target.value)}
          placeholder="Hola, quisiera información sobre..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Dirección</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="C. Esteban Arze 1355" />
        </div>
        <div className="space-y-1">
          <Label>Ciudad</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cochabamba" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Link de Google Maps</Label>
        <Input value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} placeholder="https://www.google.com/maps/place/..." />
        <p className="text-[11px] text-vous-text-secondary font-sans">Link de Google Maps para mostrar en la página de Nosotros.</p>
      </div>
    </div>
  );
}
