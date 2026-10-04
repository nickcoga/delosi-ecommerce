import type { ProductsQuery } from "@/lib/products/types";

export function parseProductsQuery(params: URLSearchParams): ProductsQuery {
  const category = params.get("category")?.trim() || undefined;
  const q = params.get("q")?.trim().replace(/\s+/g, " ") || undefined;
  const sortParam = params.get("sort");
  const sort =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : undefined;

  return { category, q, sort };
}
