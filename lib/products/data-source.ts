export type ProductsDataSource = "live" | "fixtures";

export function resolveProductsDataSource(
  env: Record<string, string | undefined> = process.env,
): ProductsDataSource {
  if (env.NODE_ENV === "production") {
    return "live";
  }
  return env.PRODUCTS_DATA_SOURCE === "fixtures" ? "fixtures" : "live";
}
