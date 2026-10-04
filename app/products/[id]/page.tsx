import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetails } from "@/components/products/ProductDetails";
import { getProduct } from "@/lib/products/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getProduct(id);

  if (!result.ok) {
    return { title: "Producto | Delosi Ecommerce" };
  }

  const { title, description, imageUrl } = result.data;
  return {
    title: `${title} | Delosi Ecommerce`,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const result = await getProduct(id);

  if (!result.ok) {
    if (result.error.kind === "not_found") {
      notFound();
    }

    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-medium text-red-900">
            No se pudo cargar el producto
          </h1>
          <p className="mt-2 text-sm text-red-800">
            El servicio de productos no responde en este momento. Vuelve a intentarlo más tarde.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex text-sm font-medium text-red-900 underline underline-offset-4"
          >
            Volver al catálogo
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
        Volver al catálogo
      </Link>
      <ProductDetails product={result.data} />
    </main>
  );
}
