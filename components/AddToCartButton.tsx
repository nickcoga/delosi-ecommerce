"use client";

import type { CartItem } from "@/lib/cart/store";
import { useCartStore } from "@/lib/cart/store";

type AddToCartButtonProps = {
  product: Omit<CartItem, "quantity">;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
    >
      Agregar al carrito
    </button>
  );
}
