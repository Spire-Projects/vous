"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { CartContextValue, CartItem, CartState } from "@/types/cart.types";
import { nanoid } from "nanoid";

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      const items = existing
        ? state.items.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          )
        : [...state.items, { ...action.payload, id: nanoid() }];
      return computeTotals({ ...state, items });
    }
    case "REMOVE_ITEM":
      return computeTotals({ ...state, items: state.items.filter((i) => i.id !== action.payload) });
    case "UPDATE_QUANTITY":
      return computeTotals({
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      });
    case "CLEAR_CART":
      return { items: [], totalItems: 0, totalPrice: 0 };
    default:
      return state;
  }
}

function computeTotals(state: CartState): CartState {
  return {
    ...state,
    totalItems: state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], totalItems: 0, totalPrice: 0 });

  const value: CartContextValue = {
    ...state,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    updateQuantity: (id, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
