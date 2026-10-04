import { cache } from "react";

import { fetchFakeStoreJson } from "@/lib/products/fake-store/client";
import { isFakeStoreProductDTO } from "@/lib/products/fake-store/dto";
import { toProduct } from "@/lib/products/fake-store/mapper";
import type { Product, ProductsResult } from "@/lib/products/types";

const PRODUCT_ID_PATTERN = /^[1-9]\d*$/;

export const getProduct = cache(async (id: string): Promise<ProductsResult<Product>> => {
  if (!PRODUCT_ID_PATTERN.test(id)) {
    return { ok: false, error: { kind: "not_found" } };
  }

  const result = await fetchFakeStoreJson(`/products/${id}`, isFakeStoreProductDTO);
  if (!result.ok) {
    if (result.error.kind === "http" && result.error.status === 404) {
      return { ok: false, error: { kind: "not_found" } };
    }
    return result;
  }

  return { ok: true, data: toProduct(result.data) };
});
