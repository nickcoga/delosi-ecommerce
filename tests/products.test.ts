import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { resolveProductsDataSource } from "@/lib/products/data-source";
import { getCategories, getProducts } from "@/lib/products/catalog";
import { isFakeStoreProductDTO, isFakeStoreProductList } from "@/lib/products/fake-store/dto";
import { toProduct } from "@/lib/products/fake-store/mapper";
import { FIXTURE_PRODUCTS } from "@/lib/products/fixtures/products";
import { getProduct } from "@/lib/products/product";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function setEnv(values: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function stubFetch(status: number) {
  globalThis.fetch = async () => new Response("upstream error", { status });
}

function forbidFetch() {
  globalThis.fetch = async () => {
    throw new Error("fetch must not be called in fixtures mode");
  };
}

beforeEach(() => {
  setEnv({ NODE_ENV: "test", PRODUCTS_DATA_SOURCE: "fixtures" });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

describe("data source resolution", () => {
  it("defaults to live outside production", () => {
    assert.equal(resolveProductsDataSource({ NODE_ENV: "development" }), "live");
    assert.equal(resolveProductsDataSource({ NODE_ENV: "test" }), "live");
  });

  it("uses fixtures only when explicitly requested outside production", () => {
    assert.equal(
      resolveProductsDataSource({ NODE_ENV: "development", PRODUCTS_DATA_SOURCE: "fixtures" }),
      "fixtures",
    );
  });

  it("forces live in production even when fixtures are requested", () => {
    assert.equal(
      resolveProductsDataSource({ NODE_ENV: "production", PRODUCTS_DATA_SOURCE: "fixtures" }),
      "live",
    );
  });
});

describe("fixtures", () => {
  it("are a valid Fake Store DTO list", () => {
    assert.equal(isFakeStoreProductList(FIXTURE_PRODUCTS), true);
    for (const product of FIXTURE_PRODUCTS) {
      assert.equal(isFakeStoreProductDTO(product), true, `product ${product.id}`);
    }
  });

  it("have unique ids and cover several categories, prices and ratings", () => {
    const ids = new Set(FIXTURE_PRODUCTS.map((product) => product.id));
    assert.equal(ids.size, FIXTURE_PRODUCTS.length);
    assert.ok(FIXTURE_PRODUCTS.length >= 6 && FIXTURE_PRODUCTS.length <= 8);
    const categories = new Set(FIXTURE_PRODUCTS.map((product) => product.category));
    assert.equal(categories.size, 4);
    const prices = FIXTURE_PRODUCTS.map((product) => product.price);
    assert.ok(Math.min(...prices) < 20 && Math.max(...prices) > 300);
  });

  it("map to Product through the existing mapper", () => {
    const product = toProduct(FIXTURE_PRODUCTS[0]);
    assert.deepEqual(Object.keys(product).sort(), [
      "category",
      "description",
      "id",
      "imageUrl",
      "price",
      "rating",
      "title",
    ]);
    assert.equal(product.imageUrl, FIXTURE_PRODUCTS[0].image);
  });
});

describe("getProducts in fixtures mode", () => {
  it("returns the whole catalog without query params and never calls fetch", async () => {
    forbidFetch();
    const result = await getProducts({});
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.data.length, FIXTURE_PRODUCTS.length);
  });

  it("searches titles case-insensitively", async () => {
    forbidFetch();
    const lower = await getProducts({ q: "gold" });
    const upper = await getProducts({ q: "GOLD" });
    assert.equal(lower.ok && lower.data.length, 2);
    assert.deepEqual(lower, upper);
  });

  it("filters by category", async () => {
    forbidFetch();
    const result = await getProducts({ category: "electronics" });
    assert.equal(result.ok && result.data.every((p) => p.category === "electronics"), true);
    assert.equal(result.ok && result.data.length, 3);
  });

  it("ignores an unknown category", async () => {
    forbidFetch();
    const result = await getProducts({ category: "nope" });
    assert.equal(result.ok && result.data.length, FIXTURE_PRODUCTS.length);
  });

  it("sorts by price ascending and descending", async () => {
    forbidFetch();
    const asc = await getProducts({ sort: "price-asc" });
    const desc = await getProducts({ sort: "price-desc" });
    assert.ok(asc.ok && asc.data.every((p, i, arr) => i === 0 || arr[i - 1].price <= p.price));
    assert.ok(desc.ok && desc.data.every((p, i, arr) => i === 0 || arr[i - 1].price >= p.price));
  });

  it("returns an empty success for a search without matches", async () => {
    forbidFetch();
    const result = await getProducts({ q: "zzz-sin-resultados" });
    assert.deepEqual(result, { ok: true, data: [] });
  });

  it("combines category, search and sort", async () => {
    forbidFetch();
    const result = await getProducts({ category: "jewelery", q: "gold", sort: "price-desc" });
    assert.ok(result.ok);
    if (result.ok) {
      assert.deepEqual(
        result.data.map((p) => p.id),
        [8, 4],
      );
    }
  });

  it("serves categories derived from the fixtures", async () => {
    forbidFetch();
    const result = await getCategories();
    assert.deepEqual(result, {
      ok: true,
      data: ["electronics", "jewelery", "men's clothing", "women's clothing"],
    });
  });
});

describe("getProduct in fixtures mode", () => {
  it("finds a fixture by id", async () => {
    forbidFetch();
    const result = await getProduct("1");
    assert.equal(result.ok && result.data.id, 1);
  });

  it("maps a missing id to not_found", async () => {
    forbidFetch();
    assert.deepEqual(await getProduct("999"), { ok: false, error: { kind: "not_found" } });
  });

  it("maps an invalid id to not_found without touching the source", async () => {
    forbidFetch();
    assert.deepEqual(await getProduct("abc"), { ok: false, error: { kind: "not_found" } });
  });
});

describe("error contract is unchanged for live mode", () => {
  it("returns http errors from the live source, never fixtures", async () => {
    setEnv({ NODE_ENV: "test", PRODUCTS_DATA_SOURCE: undefined });
    stubFetch(522);
    assert.deepEqual(await getProducts({}), { ok: false, error: { kind: "http", status: 522 } });
  });

  it("ignores PRODUCTS_DATA_SOURCE=fixtures in production and reports live errors", async () => {
    setEnv({ NODE_ENV: "production", PRODUCTS_DATA_SOURCE: "fixtures" });
    stubFetch(522);
    assert.deepEqual(await getProducts({}), { ok: false, error: { kind: "http", status: 522 } });
  });
});
