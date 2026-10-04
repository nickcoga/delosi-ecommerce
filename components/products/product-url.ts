import { parseProductsQuery } from "@/lib/products/parse-query";
import type { ProductsQuery } from "@/lib/products/types";

type ProductsQueryKey = keyof ProductsQuery;
type ProductsQueryPatch = Partial<Record<ProductsQueryKey, string>>;

export function buildProductsHref(
  pathname: string,
  currentSearch: string,
  patch: ProductsQueryPatch,
): string {
  const current = parseProductsQuery(new URLSearchParams(currentSearch));
  const merged = new URLSearchParams();
  const next = { ...current, ...patch };

  for (const key of ["category", "q", "sort"] as const) {
    const value = next[key]?.trim();
    if (value) {
      merged.set(key, value);
    }
  }

  const canonical = parseProductsQuery(merged);
  const out = new URLSearchParams();
  if (canonical.category) out.set("category", canonical.category);
  if (canonical.q) out.set("q", canonical.q);
  if (canonical.sort) out.set("sort", canonical.sort);

  const search = out.toString();
  return search ? `${pathname}?${search}` : pathname;
}
