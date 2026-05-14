"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, LogOut, Package } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";

interface HeaderIconsProps {
  onSearchOpen: () => void;
}

export function HeaderIcons({ onSearchOpen }: HeaderIconsProps) {
  const { user, signOut } = useAuthContext();
  const { totalItems } = useCartContext();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onSearchOpen}
        aria-label="Buscar"
        className="text-vous-soft-black hover:text-vous-gold transition-colors duration-200"
      >
        <Search size={20} strokeWidth={1.5} />
      </button>

      <Link
        href="/carrito"
        aria-label={`Carrito — ${totalItems} artículos`}
        className="relative text-vous-soft-black hover:text-vous-gold transition-colors duration-200"
      >
        <ShoppingBag size={20} strokeWidth={1.5} />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-vous-gold text-white text-[10px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </Link>

      {user ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              aria-label="Mi cuenta"
              className="text-vous-soft-black hover:text-vous-gold transition-colors duration-200"
            >
              <User size={20} strokeWidth={1.5} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="bg-white border border-vous-gray-light shadow-sm min-w-[180px] z-50 py-1"
            >
              <DropdownMenu.Item asChild>
                <Link
                  href="/cuenta"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-vous-soft-black hover:bg-vous-cream hover:text-vous-gold transition-colors cursor-pointer"
                >
                  <User size={15} /> Mi Cuenta
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link
                  href="/cuenta/pedidos"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-vous-soft-black hover:bg-vous-cream hover:text-vous-gold transition-colors cursor-pointer"
                >
                  <Package size={15} /> Mis Pedidos
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-vous-gray-light my-1" />
              <DropdownMenu.Item
                onSelect={() => void signOut()}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-vous-soft-black hover:bg-vous-cream hover:text-vous-gold transition-colors cursor-pointer"
              >
                <LogOut size={15} /> Cerrar Sesión
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <Link
          href="/auth/login"
          className="hidden md:inline-flex font-sans text-[12px] font-semibold tracking-[0.12em] text-vous-soft-black hover:text-vous-gold transition-colors duration-200"
        >
          INICIAR SESIÓN
        </Link>
      )}
    </div>
  );
}
