"use client";

import { selectItemCount, useCartStore } from "@/lib/cart/store";

export function CartCounter() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const itemCount = useCartStore(selectItemCount);

  return (
    <span
      aria-label="Productos en el carrito"
      className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-2 py-0.5 text-xs leading-none font-medium text-background"
    >
      {hasHydrated ? itemCount : null}
    </span>
  );
}
