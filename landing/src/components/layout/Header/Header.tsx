"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { clsx } from "clsx";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNav } from "./HeaderNav";
import { HeaderIcons } from "./HeaderIcons";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { SearchModal } from "@/components/layout/SearchModal";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 h-14 transition-all duration-300 border-b",
          scrolled ? "bg-white border-black/5 shadow-sm" : "bg-white border-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            className="md:hidden text-black hover:text-black transition-colors p-1"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <HeaderLogo />
          <HeaderNav pathname={pathname} />
          <HeaderIcons onSearchOpen={() => setSearchOpen(true)} />
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} pathname={pathname} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Spacer para compensar el header fixed */}
      <div className="h-14" aria-hidden="true" />
    </>
  );
}
