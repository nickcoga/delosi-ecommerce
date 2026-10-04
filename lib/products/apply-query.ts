import type { Product, ProductsQuery } from "@/lib/products/types";

export function applyProductsQuery(
  products: readonly Product[],
  query: ProductsQuery,
): Product[] {
  const knownCategories = new Set(products.map((product) => product.category));
  const category =
    query.category !== undefined && knownCategories.has(query.category)
      ? query.category
      : undefined;
  const needle = query.q?.toLowerCase();

  const filtered = products.filter(
    (product) =>
      (category === undefined || product.category === category) &&
      (needle === undefined || product.title.toLowerCase().includes(needle)),
  );

  if (query.sort === undefined) {
    return filtered;
  }

  const direction = query.sort === "price-asc" ? 1 : -1;
  return filtered.sort((a, b) => (a.price - b.price) * direction);
}
