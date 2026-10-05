"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SubmitEvent } from "react";

import { buildProductsHref } from "@/components/products/product-url";
import type { ProductsQuery } from "@/lib/products/types";

type ProductFiltersProps = {
  query: ProductsQuery;
  categories: string[];
};

const controlClassName =
  "h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function ProductFilters({ query, categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(patch: Parameters<typeof buildProductsHref>[2]) {
    router.push(buildProductsHref(pathname, searchParams.toString(), patch), {
      scroll: false,
    });
  }

  function handleSearch(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    navigate({ q: String(formData.get("q") ?? "") });
  }

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <form
        role="search"
        onSubmit={handleSearch}
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="product-search" className="text-sm font-medium text-zinc-800">
            Buscar productos
          </label>
          <input
            key={query.q ?? ""}
            id="product-search"
            name="q"
            type="search"
            defaultValue={query.q ?? ""}
            placeholder="Por ejemplo: gold"
            className={`${controlClassName} w-full sm:w-72`}
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-1">
          <label htmlFor="product-category" className="text-sm font-medium text-zinc-800">
            Categoría
          </label>
          <select
            id="product-category"
            value={query.category ?? ""}
            onChange={(event) => navigate({ category: event.target.value })}
            className={`${controlClassName} w-full sm:w-56`}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="product-sort" className="text-sm font-medium text-zinc-800">
            Ordenar por
          </label>
          <select
            id="product-sort"
            value={query.sort ?? ""}
            onChange={(event) => navigate({ sort: event.target.value })}
            className={`${controlClassName} w-full sm:w-56`}
          >
            <option value="">Predeterminado</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </div>
  );
}
