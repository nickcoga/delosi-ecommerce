const CARD_COUNT = 8;

export default function ProductsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black">
        Productos
      </h1>

      <div role="status">
        <span className="sr-only">Cargando productos</span>

        <div aria-hidden="true">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-1">
                <div className="h-5 w-40 rounded bg-zinc-200 motion-safe:animate-pulse" />
                <div className="h-11 w-full rounded-md bg-zinc-200 motion-safe:animate-pulse sm:w-72" />
              </div>
              <div className="h-11 w-24 rounded-md bg-zinc-200 motion-safe:animate-pulse" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col gap-1">
                <div className="h-5 w-20 rounded bg-zinc-200 motion-safe:animate-pulse" />
                <div className="h-11 w-full rounded-md bg-zinc-200 motion-safe:animate-pulse sm:w-56" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-5 w-24 rounded bg-zinc-200 motion-safe:animate-pulse" />
                <div className="h-11 w-full rounded-md bg-zinc-200 motion-safe:animate-pulse sm:w-56" />
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: CARD_COUNT }, (_, index) => (
              <li key={index}>
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-black/[.08] bg-white">
                  <div className="aspect-square w-full bg-zinc-50 p-10">
                    <div className="h-full w-full rounded bg-zinc-200 motion-safe:animate-pulse" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex h-4 items-center">
                      <div className="h-3 w-16 rounded bg-zinc-200 motion-safe:animate-pulse" />
                    </div>
                    <div className="flex min-h-12 flex-col justify-center">
                      <div className="flex h-6 items-center">
                        <div className="h-3 w-full rounded bg-zinc-200 motion-safe:animate-pulse" />
                      </div>
                      <div className="flex h-6 items-center">
                        <div className="h-3 w-3/4 rounded bg-zinc-200 motion-safe:animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-auto flex h-7 items-center">
                      <div className="h-5 w-20 rounded bg-zinc-200 motion-safe:animate-pulse" />
                    </div>
                    <div className="flex h-5 items-center">
                      <div className="h-3 w-40 rounded bg-zinc-200 motion-safe:animate-pulse" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
