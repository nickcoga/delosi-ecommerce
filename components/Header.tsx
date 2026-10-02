import Link from "next/link";

import { CartCounter } from "@/components/CartCounter";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-black/[.08] px-6 py-4 dark:border-white/[.145]">
      <Link href="/" className="font-semibold text-black dark:text-zinc-50">
        Delosi Ecommerce
      </Link>
      <CartCounter />
    </header>
  );
}
