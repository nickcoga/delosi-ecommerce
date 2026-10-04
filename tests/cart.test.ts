import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { memoryStorage } from "@/tests/local-storage-shim";
import { selectItemCount, useCartStore } from "@/lib/cart/store";

const CART_KEY = "delosi-cart";

const headphones = {
  productId: 1,
  title: "Auriculares inalámbricos con cancelación de ruido",
  price: 129.99,
  image: "/fixtures/products/auriculares-inalambricos.jpg",
};

const bracelet = {
  productId: 4,
  title: "Pulsera gold plated de acero inoxidable",
  price: 15,
  image: "/fixtures/products/pulsera-gold-plated.avif",
};

function items() {
  return useCartStore.getState().items;
}

function persistedState() {
  const raw = memoryStorage.getItem(CART_KEY);
  return raw === null ? null : JSON.parse(raw);
}

beforeEach(() => {
  memoryStorage.clear();
  useCartStore.setState({ items: [] });
});

describe("initial state", () => {
  it("starts with an empty cart", () => {
    assert.deepEqual(items(), []);
  });
});

describe("addItem", () => {
  it("creates a new line with quantity 1 and keeps the cart item fields", () => {
    useCartStore.getState().addItem(headphones);

    assert.deepEqual(items(), [{ ...headphones, quantity: 1 }]);
  });

  it("adds the same product twice without duplicating the line", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(headphones);

    assert.equal(items().length, 1);
    assert.equal(items()[0].quantity, 2);
  });

  it("adds the same product three times without duplicating the line", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(headphones);

    assert.equal(items().length, 1);
    assert.equal(items()[0].quantity, 3);
  });

  it("keeps separate lines and quantities for different products", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(bracelet);

    assert.equal(items().length, 2);
    assert.equal(items().find((i) => i.productId === 1)?.quantity, 2);
    assert.equal(items().find((i) => i.productId === 4)?.quantity, 1);
  });

  it("accepts an explicit quantity and sanitizes it to a positive integer", () => {
    useCartStore.getState().addItem(headphones, 5);
    assert.equal(items()[0].quantity, 5);

    useCartStore.setState({ items: [] });
    useCartStore.getState().addItem(headphones, 0);
    assert.equal(items()[0].quantity, 1);

    useCartStore.setState({ items: [] });
    useCartStore.getState().addItem(headphones, 2.7);
    assert.equal(items()[0].quantity, 2);
  });
});

describe("setQuantity", () => {
  it("updates an existing quantity and keeps the other fields", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().setQuantity(1, 4);

    assert.deepEqual(items(), [{ ...headphones, quantity: 4 }]);
  });

  it("removes the line when quantity is 0", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(bracelet);
    useCartStore.getState().setQuantity(1, 0);

    assert.deepEqual(items().map((i) => i.productId), [4]);
  });

  it("removes the line when quantity is negative", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().setQuantity(1, -2);

    assert.deepEqual(items(), []);
  });

  it("ignores a productId that is not in the cart", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().setQuantity(999, 3);

    assert.deepEqual(items(), [{ ...headphones, quantity: 1 }]);
  });
});

describe("removeItem", () => {
  it("removes only the requested product", () => {
    useCartStore.getState().addItem(headphones);
    useCartStore.getState().addItem(bracelet);
    useCartStore.getState().removeItem(1);

    assert.deepEqual(items().map((i) => i.productId), [4]);
    assert.equal(items()[0].title, bracelet.title);
  });
});

describe("selectItemCount", () => {
  it("counts units across all lines", () => {
    useCartStore.getState().addItem(headphones, 3);
    useCartStore.getState().addItem(bracelet);

    assert.equal(selectItemCount(useCartStore.getState()), 4);
  });
});

describe("persistence", () => {
  it("writes only items under the existing storage key", () => {
    useCartStore.getState().addItem(headphones, 3);

    const stored = persistedState();
    assert.equal(stored.version, 0);
    assert.deepEqual(Object.keys(stored.state), ["items"]);
    assert.deepEqual(stored.state.items, [{ ...headphones, quantity: 3 }]);
  });

  it("does not persist hasHydrated", () => {
    useCartStore.getState().addItem(headphones);

    assert.equal("hasHydrated" in persistedState().state, false);
  });

  it("restores items from storage on rehydrate and marks the store as hydrated", async () => {
    useCartStore.setState({ items: [], hasHydrated: false });
    memoryStorage.setItem(
      CART_KEY,
      JSON.stringify({ state: { items: [{ ...bracelet, quantity: 2 }] }, version: 0 }),
    );

    await useCartStore.persist.rehydrate();

    assert.deepEqual(items(), [{ ...bracelet, quantity: 2 }]);
    assert.equal(useCartStore.getState().hasHydrated, true);
  });
});
