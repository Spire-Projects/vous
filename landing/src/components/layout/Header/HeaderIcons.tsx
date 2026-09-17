"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";

interface HeaderIconsProps {
  onSearchOpen: () => void;
}

export function HeaderIcons({ onSearchOpen }: HeaderIconsProps) {
  const { user, signOut } = useAuthContext();
  const { totalItems } = useCartContext();

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <button
        onClick={onSearchOpen}
        aria-label="Buscar"
        className="text-black/60 hover:text-black transition-colors duration-200 p-1"
      >
        <Search size={20} strokeWidth={1.5} />
      </button>

      <Link
        href="/carrito"
        aria-label={`Carrito — ${totalItems} artículos`}
        className="relative text-black/60 hover:text-black transition-colors duration-200 p-1"
      >
        <ShoppingBag size={20} strokeWidth={1.5} />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Mi cuenta"
            className="text-black/60 hover:text-black transition-colors duration-200 p-1"
          >
            <User size={20} strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Link
                href="/cuenta"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-black hover:bg-gray-50 hover:text-black transition-colors w-full"
              >
                <User size={15} /> Mi Cuenta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => void signOut()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-black hover:bg-gray-50 hover:text-black transition-colors cursor-pointer"
            >
              <LogOut size={15} /> Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/auth/login"
          className="hidden md:inline-flex font-sans text-[11px] font-medium tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200"
        >
          INICIAR SESIÓN
        </Link>
      )}
    </div>
  );
}
