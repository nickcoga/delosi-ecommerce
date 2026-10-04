export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type ProductSort = "price-asc" | "price-desc";

export type ProductsQuery = {
  category?: string;
  q?: string;
  sort?: ProductSort;
};

export type ProductsError =
  | { kind: "http"; status: number }
  | { kind: "network" }
  | { kind: "timeout" }
  | { kind: "invalid_payload" };

export type ProductsResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ProductsError };
