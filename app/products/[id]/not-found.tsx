import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Producto no encontrado | Delosi Ecommerce",
};

export default function ProductNotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <section className="rounded-lg border border-black/[.08] p-8 text-center">
        <h1 className="text-2xl font-semibold text-zinc-950">
          Producto no encontrado
        </h1>
        <p className="mt-3 text-zinc-600">
          El producto que buscas no existe o ya no está disponible.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background"
        >
          Ver catálogo
        </Link>
      </section>
    </main>
  );
}
