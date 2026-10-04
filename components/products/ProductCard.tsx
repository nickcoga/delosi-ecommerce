import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/products/types";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-black/[.08] bg-white">
      <div className="relative aspect-square w-full bg-zinc-50">
        <Image
          src={product.imageUrl}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-6"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {product.category}
        </p>
        <h2 className="line-clamp-2 text-base font-medium text-zinc-950">
          <Link
            href={`/products/${product.id}`}
            className="after:absolute after:inset-0 hover:underline"
          >
            {product.title}
          </Link>
        </h2>
        <p className="mt-auto text-lg font-semibold text-zinc-950">
          {priceFormatter.format(product.price)}
        </p>
        <p className="text-sm text-zinc-600">
          Valoración: {product.rating.rate.toFixed(1)} ({product.rating.count} opiniones)
        </p>
      </div>
    </article>
  );
}
