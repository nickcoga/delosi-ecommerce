import Image from "next/image";

import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product } from "@/lib/products/types";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductDetails({ product }: { product: Product }) {
  return (
    <article className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-50">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-8"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {product.category}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {product.title}
        </h1>
        <p className="text-sm text-zinc-600">
          Valoración: {product.rating.rate.toFixed(1)} ({product.rating.count} opiniones)
        </p>
        <p className="text-2xl font-semibold text-zinc-950">
          {priceFormatter.format(product.price)}
        </p>
        <p className="leading-7 text-zinc-700">{product.description}</p>
        <div className="mt-4">
          <AddToCartButton
            product={{
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.imageUrl,
            }}
          />
        </div>
      </div>
    </article>
  );
}
