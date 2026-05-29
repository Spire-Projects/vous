"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountSidebar } from "@/components/cuenta/AccountSidebar";
import { TabPerfil } from "@/components/cuenta/TabPerfil";
import { TabPedidos } from "@/components/cuenta/TabPedidos";
import { TabMayorista } from "@/components/cuenta/TabMayorista";
import { TabDirecciones } from "@/components/cuenta/TabDirecciones";
import { useAuthContext } from "@/context/AuthContext";

type TabId = "perfil" | "pedidos" | "mayorista" | "direcciones";

export default function CuentaPage() {
  const { user, loading, signOut } = useAuthContext();
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("perfil");

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <AccountSidebar
            active={tab}
            onTab={(id) => setTab(id as TabId)}
            onLogout={handleLogout}
          />
          <main className="flex-1 min-w-0">
            {tab === "perfil" && <TabPerfil />}
            {tab === "pedidos" && <TabPedidos userId={user.uid} />}
            {tab === "mayorista" && <TabMayorista />}
            {tab === "direcciones" && <TabDirecciones />}
          </main>
        </div>
      </div>
    </div>
  );
}
