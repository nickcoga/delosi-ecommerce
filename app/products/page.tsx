import { ProductCard } from "@/components/products/ProductCard";
import { getProducts } from "@/lib/products/catalog";
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
  const query = parseProductsQuery(toURLSearchParams(await searchParams));
  const result = await getProducts(query);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black">
        Productos
      </h1>

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
          {result.data.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
