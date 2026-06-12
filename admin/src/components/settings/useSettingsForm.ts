import { useState, useEffect } from "react";
import type { SiteConfig, UpdateSiteConfigInput, ScheduleItem, ExtendedSchedule, DepartmentLink, ContentSection, FeedbackSection } from "@/domain/entities/site-config.entity";
import { DEFAULT_SCHEDULE, DEFAULT_EXTENDED, emptySchedule } from "./constants";

export function useSettingsForm(config: SiteConfig | null) {
  const [logoUrl, setLogoUrl] = useState("");
  const [storeName, setStoreName] = useState("VOUS");
  const [tagline, setTagline] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [instagramActive, setInstagramActive] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [tiktokActive, setTiktokActive] = useState(false);
  const [ubicacionUrl, setUbicacionUrl] = useState("");
  const [ubicacionActive, setUbicacionActive] = useState(false);
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [extendedSchedules, setExtendedSchedules] = useState<ExtendedSchedule[]>(
    DEFAULT_EXTENDED.map(emptySchedule)
  );
  const [departmentLinks, setDepartmentLinks] = useState<DepartmentLink[]>([]);
  const [otherCountryLinks, setOtherCountryLinks] = useState<DepartmentLink[]>([]);

  const [fashionTrends, setFashionTrends] = useState<ContentSection>({
    isActive: false, title: "", subtitle: "", content: "", imageUrl: "", linkUrl: "",
  });
  const [vousNews, setVousNews] = useState<ContentSection>({
    isActive: false, title: "", subtitle: "", content: "", imageUrl: "", linkUrl: "",
  });
  const [newPosts, setNewPosts] = useState<ContentSection>({
    isActive: false, title: "", subtitle: "", content: "", imageUrl: "", linkUrl: "",
  });
  const [feedback, setFeedback] = useState<FeedbackSection>({
    isActive: false, title: "", subtitle: "", successMessage: "Gracias por tu mensaje. Lo hemos recibido correctamente.", emailRecipient: "",
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!config) return;
    setLogoUrl(config.logoUrl);
    setStoreName(config.storeName);
    setTagline(config.tagline);
    setWhatsappNumber(config.whatsappNumber);
    setWhatsappMessage(config.whatsappMessage);
    setEmail(config.email);
    setAddress(config.address);
    setCity(config.city);
    setGoogleMapsUrl(config.googleMapsUrl);
    setInstagramUrl(config.instagram?.url ?? "");
    setInstagramActive(config.instagram?.active ?? false);
    setTiktokUrl(config.tiktok?.url ?? "");
    setTiktokActive(config.tiktok?.active ?? false);
    setUbicacionUrl(config.ubicacion?.url ?? "");
    setUbicacionActive(config.ubicacion?.active ?? false);
    setShippingPolicy(config.shippingPolicy);
    setReturnPolicy(config.returnPolicy);
    setTermsOfService(config.termsOfService);
    setSchedule(config.schedule?.length ? config.schedule : DEFAULT_SCHEDULE);
    setExtendedSchedules(
      config.extendedSchedules?.length
        ? config.extendedSchedules
        : DEFAULT_EXTENDED.map(emptySchedule)
    );
    setDepartmentLinks(config.departmentLinks?.length ? config.departmentLinks : []);
    setOtherCountryLinks(config.otherCountryLinks?.length ? config.otherCountryLinks : []);
    setFashionTrends(config.fashionTrends ?? { isActive: false, title: "", subtitle: "", content: "", imageUrl: "", linkUrl: "" });
    setVousNews(config.vousNews ?? { isActive: false, title: "", subtitle: "", content: "", imageUrl: "", linkUrl: "" });
    setNewPosts(config.newPosts ?? { isActive: false, title: "", subtitle: "", content: "", imageUrl: "", linkUrl: "" });
    setFeedback(config.feedback ?? { isActive: false, title: "", subtitle: "", successMessage: "Gracias por tu mensaje. Lo hemos recibido correctamente.", emailRecipient: "" });
  }, [config]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function toInput(): UpdateSiteConfigInput {
    return {
      logoUrl,
      storeName,
      tagline,
      whatsappNumber,
      whatsappMessage,
      email,
      address,
      city,
      googleMapsUrl,
      instagram: { url: instagramUrl, active: instagramActive },
      tiktok: { url: tiktokUrl, active: tiktokActive },
      ubicacion: { url: ubicacionUrl, active: ubicacionActive },
      shippingPolicy,
      returnPolicy,
      termsOfService,
      schedule: schedule.filter((s) => s.hours.trim() !== ""),
      extendedSchedules: extendedSchedules.map((es) => ({
        ...es,
        days: es.days.filter((d) => d.hours.trim() !== ""),
      })),
      departmentLinks: departmentLinks.filter((d) => d.name.trim() !== ""),
      otherCountryLinks: otherCountryLinks.filter((d) => d.name.trim() !== ""),
      fashionTrends,
      vousNews,
      newPosts,
      feedback,
    };
  }

  return {
    logoUrl, setLogoUrl,
    storeName, setStoreName,
    tagline, setTagline,
    whatsappNumber, setWhatsappNumber,
    whatsappMessage, setWhatsappMessage,
    email, setEmail,
    address, setAddress,
    city, setCity,
    googleMapsUrl, setGoogleMapsUrl,
    instagramUrl, setInstagramUrl, instagramActive, setInstagramActive,
    tiktokUrl, setTiktokUrl, tiktokActive, setTiktokActive,
    ubicacionUrl, setUbicacionUrl, ubicacionActive, setUbicacionActive,
    shippingPolicy, setShippingPolicy,
    returnPolicy, setReturnPolicy,
    termsOfService, setTermsOfService,
    schedule, setSchedule,
    extendedSchedules, setExtendedSchedules,
    departmentLinks, setDepartmentLinks,
    otherCountryLinks, setOtherCountryLinks,
    fashionTrends, setFashionTrends,
    vousNews, setVousNews,
    newPosts, setNewPosts,
    feedback, setFeedback,
    toInput,
  };
}
