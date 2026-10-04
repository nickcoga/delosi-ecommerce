export default function ProductLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div role="status">
        <span className="sr-only">Cargando producto</span>

        <div aria-hidden="true" className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="aspect-square w-full rounded-lg bg-zinc-50 p-8">
            <div className="h-full w-full rounded bg-zinc-200 motion-safe:animate-pulse" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex h-4 items-center">
              <div className="h-3 w-20 rounded bg-zinc-200 motion-safe:animate-pulse" />
            </div>
            <div className="flex h-9 items-center">
              <div className="h-6 w-3/4 rounded bg-zinc-200 motion-safe:animate-pulse" />
            </div>
            <div className="flex h-5 items-center">
              <div className="h-3 w-48 rounded bg-zinc-200 motion-safe:animate-pulse" />
            </div>
            <div className="flex h-8 items-center">
              <div className="h-6 w-28 rounded bg-zinc-200 motion-safe:animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex h-7 items-center">
                <div className="h-3 w-full rounded bg-zinc-200 motion-safe:animate-pulse" />
              </div>
              <div className="flex h-7 items-center">
                <div className="h-3 w-full rounded bg-zinc-200 motion-safe:animate-pulse" />
              </div>
              <div className="flex h-7 items-center">
                <div className="h-3 w-2/3 rounded bg-zinc-200 motion-safe:animate-pulse" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-12 w-56 rounded-full bg-zinc-200 motion-safe:animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
