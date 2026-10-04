import { FIXTURE_PRODUCTS } from "@/lib/products/fixtures/products";

const PRODUCT_PATH = /^\/products\/(\d+)$/;

export function readFixtureBody(path: string): unknown {
  if (path === "/products") {
    return FIXTURE_PRODUCTS;
  }

  if (path === "/products/categories") {
    return [...new Set(FIXTURE_PRODUCTS.map((product) => product.category))];
  }

  const match = PRODUCT_PATH.exec(path);
  if (match) {
    return FIXTURE_PRODUCTS.find((product) => product.id === Number(match[1]));
  }

  return undefined;
}
