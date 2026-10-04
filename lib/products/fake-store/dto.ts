export type FakeStoreProductDTO = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isFakeStoreProductDTO(
  value: unknown,
): value is FakeStoreProductDTO {
  if (!isObject(value) || !isObject(value.rating)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.price === "number" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.image === "string" &&
    typeof value.rating.rate === "number" &&
    typeof value.rating.count === "number"
  );
}

export function isFakeStoreProductList(
  value: unknown,
): value is FakeStoreProductDTO[] {
  return Array.isArray(value) && value.every(isFakeStoreProductDTO);
}

export function isCategoryList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
