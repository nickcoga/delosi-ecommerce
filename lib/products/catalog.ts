import { applyProductsQuery } from "@/lib/products/apply-query";
import { fetchFakeStoreJson } from "@/lib/products/fake-store/client";
import {
  isCategoryList,
  isFakeStoreProductList,
} from "@/lib/products/fake-store/dto";
import { toProduct } from "@/lib/products/fake-store/mapper";
import type {
  Product,
  ProductsQuery,
  ProductsResult,
} from "@/lib/products/types";

export async function getProducts(
  query: ProductsQuery,
): Promise<ProductsResult<Product[]>> {
  const result = await fetchFakeStoreJson("/products", isFakeStoreProductList);
  if (!result.ok) {
    return result;
  }

  const products = result.data.map(toProduct);
  return { ok: true, data: applyProductsQuery(products, query) };
}

export async function getCategories(): Promise<ProductsResult<string[]>> {
  return fetchFakeStoreJson("/products/categories", isCategoryList);
}
