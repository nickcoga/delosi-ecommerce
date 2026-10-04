const ROOT = new URL("../", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = new URL(`${specifier.slice(2)}.ts`, ROOT).href;
    return nextResolve(target, context);
  }
  return nextResolve(specifier, context);
}
