import { useState, useEffect } from "react";
import type {
  Banner,
  CreateBannerInput,
} from "@/domain/entities/banner.entity";

interface UseBannerFormProps {
  banner: Banner | null;
  open: boolean;
  onSave: (data: CreateBannerInput) => Promise<void>;
  onClose: () => void;
}

export function useBannerForm({
  banner,
  open,
  onSave,
  onClose,
}: UseBannerFormProps) {
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [imageUrl, setImageUrl] = useState("");
  const [tabletImageUrl, setTabletImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("Ver Todo");
  const [ctaVisible, setCtaVisible] = useState(true);
  const [categorySlug, setCategorySlug] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setTab("form");
    setImageUrl(banner?.imageUrl ?? "");
    setTabletImageUrl(banner?.tabletImageUrl ?? "");
    setMobileImageUrl(banner?.mobileImageUrl ?? "");
    setTitle(banner?.title ?? "");
    setSubtitle(banner?.subtitle ?? "");
    setCtaText(banner?.ctaText || "Ver Todo");
    setCtaVisible(banner?.ctaVisible !== false);
    setCategorySlug(banner?.categorySlug ?? "");
    setActive(banner?.active ?? true);
  }, [banner, open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const ctaUrl = categorySlug
    ? `/catalogo?categoria=${categorySlug}`
    : "/catalogo";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        imageUrl,
        tabletImageUrl: tabletImageUrl.trim() || undefined,
        mobileImageUrl: mobileImageUrl.trim() || undefined,
        title,
        subtitle,
        ctaText: ctaText.trim() || "Ver Todo",
        ctaUrl,
        ctaVisible,
        categorySlug: categorySlug || undefined,
        active,
        order: banner?.order ?? 0,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return {
    tab,
    setTab,
    imageUrl,
    setImageUrl,
    tabletImageUrl,
    setTabletImageUrl,
    mobileImageUrl,
    setMobileImageUrl,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    ctaText,
    setCtaText,
    ctaVisible,
    setCtaVisible,
    categorySlug,
    setCategorySlug,
    active,
    setActive,
    saving,
    handleSubmit,
  };
}
