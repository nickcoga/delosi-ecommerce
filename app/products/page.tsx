import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { getCategories, getProducts } from "@/lib/products/catalog";
import { parseProductsQuery } from "@/lib/products/parse-query";

type SearchParams = Record<string, string | string[] | undefined>;

function toURLSearchParams(searchParams: SearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item !== undefined) {
        params.append(key, item);
      }
    }
  }
  return params;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const rawParams = toURLSearchParams(await searchParams);
  const query = parseProductsQuery(rawParams);
  const [result, categoriesResult] = await Promise.all([
    getProducts(query),
    getCategories(),
  ]);
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black">
        Productos
      </h1>

      <ProductFilters
        key={rawParams.toString()}
        query={query}
        categories={categories}
      />

      {!result.ok ? (
        <section role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-medium text-red-900">
            No se pudo cargar el catálogo
          </h2>
          <p className="mt-2 text-sm text-red-800">
            El servicio de productos no responde en este momento. Vuelve a intentarlo más tarde.
          </p>
        </section>
      ) : result.data.length === 0 ? (
        <section className="rounded-lg border border-black/[.08] p-6">
          <h2 className="text-lg font-medium text-zinc-900">
            No hay productos para mostrar
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Ningún producto coincide con los filtros de la URL.
          </p>
        </section>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {result.data.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} priority={index < 4} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
