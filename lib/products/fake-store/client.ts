import { readFixtureBody } from "@/lib/products/fixtures/fixture-body";
import { resolveProductsDataSource } from "@/lib/products/data-source";
import type { ProductsResult } from "@/lib/products/types";

const FAKE_STORE_BASE_URL = "https://fakestoreapi.com";
const REVALIDATE_SECONDS = 3600;
const TIMEOUT_MS = 10_000;

function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === "TimeoutError";
}

export async function fetchFakeStoreJson<T>(
  path: string,
  isExpected: (value: unknown) => value is T,
): Promise<ProductsResult<T>> {
  if (resolveProductsDataSource() === "fixtures") {
    const body = readFixtureBody(path);
    if (body === undefined) {
      return { ok: false, error: { kind: "http", status: 404 } };
    }
    if (!isExpected(body)) {
      return { ok: false, error: { kind: "invalid_payload" } };
    }
    return { ok: true, data: body };
  }

  let response: Response;
  try {
    response = await fetch(`${FAKE_STORE_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    return {
      ok: false,
      error: isTimeoutError(error) ? { kind: "timeout" } : { kind: "network" },
    };
  }

  if (!response.ok) {
    return { ok: false, error: { kind: "http", status: response.status } };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    if (isTimeoutError(error)) {
      return { ok: false, error: { kind: "timeout" } };
    }
    if (error instanceof SyntaxError) {
      return { ok: false, error: { kind: "invalid_payload" } };
    }
    return { ok: false, error: { kind: "network" } };
  }

  if (!isExpected(body)) {
    return { ok: false, error: { kind: "invalid_payload" } };
  }

  return { ok: true, data: body };
}
