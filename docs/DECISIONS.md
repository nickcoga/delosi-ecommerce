# Decisions

Decision log (ADR-style) para el reto Delosi Ecommerce. Se registran aquí las decisiones confirmadas (`Accepted`) y las decisiones abiertas que requieren evaluación explícita (`Proposed`, sin decidir). Las preguntas sin decisión registrada y los valores propuestos pendientes de confirmación se documentan en [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## DEC-001 — Framework y routing

**Status:** Accepted

**Context:**
El reto requiere una PLP con Server Components para carga/procesamiento inicial y una PDP en ruta dinámica (`/products/[id]`) con metadata dinámica y Open Graph. Se necesita un framework React con soporte nativo de Server Components, rutas dinámicas y generación de metadata.

**Decision:**
Usar Next.js con App Router (confirmado por el bootstrap generado con `create-next-app`, Next.js 16.3.8).

**Rationale:**
App Router provee Server Components, generación de metadata por ruta y soporte nativo de Open Graph, que son requisitos explícitos del reto.

**Consequences:**
La estructura de rutas y la separación Server/Client Components se apoyan en las convenciones de App Router (`app/`, `layout.tsx`, `page.tsx`, `metadata`).

---

## DEC-002 — Lenguaje

**Status:** Accepted

**Context:**
El reto exige TypeScript estricto como criterio técnico.

**Decision:**
Usar TypeScript con `strict: true` (confirmado en `tsconfig.json` del bootstrap).

**Rationale:**
Requisito explícito del reto; además reduce errores en tiempo de compilación al integrar datos externos de Fake Store API.

**Consequences:**
Todo el código nuevo debe tipar explícitamente los modelos de dominio y las respuestas de la API, sin uso de `any`.

---

## DEC-003 — Estilos

**Status:** Accepted

**Context:**
Se necesita una solución de estilos para construir la UI de PLP, PDP, carrito y Header.

**Decision:**
Usar Tailwind CSS v4 (confirmado en el bootstrap: `@tailwindcss/postcss`, `app/globals.css`).

**Rationale:**
Viene preconfigurado por el bootstrap de `create-next-app` y permite iterar rápido en la UI sin introducir una dependencia adicional de CSS.

**Consequences:**
Los estilos se escriben con utilidades de Tailwind; cualquier sistema de diseño adicional (tokens, componentes de UI reutilizables) queda fuera de esta decisión.

---

## DEC-004 — Fuente de datos

**Status:** Accepted

**Context:**
El reto exige integrar PLP y PDP contra una API externa específica, sin backend propio.

**Decision:**
Usar Fake Store API (`https://fakestoreapi.com`) como única fuente de datos del reto:

- `GET /products`
- `GET /products/categories`
- `GET /products/{id}`

**Rationale:**
Es la API provista explícitamente por el documento del reto.

**Consequences:**
No se implementa backend ni base de datos propia. La disponibilidad y el contrato de datos del proyecto dependen de Fake Store API.

---

## DEC-005 — Control de versiones y repositorio

**Status:** Accepted

**Context:**
El reto exige un repositorio público como entregable.

**Decision:**
Usar Git como control de versiones, con repositorio remoto en GitHub (`origin`). Al momento de tomar esta decisión, el commit inicial (`fb9d8a4`) ya estaba sincronizado con `origin/main`.

**Rationale:**
Requisito explícito de entregable del reto.

**Consequences:**
El historial de commits y el estado del repositorio remoto son parte de la evidencia de avance del reto. La sincronización con `origin/main` es el estado en el momento de cada commit, no una condición permanente: los commits locales posteriores (por ejemplo `243c12a` y `497a5a6`) pueden adelantar a `main` respecto de `origin/main` hasta que se haga `git push`. En la verificación del 2026-10-04 ambas ramas coincidían. El estado de sincronización vigente se verifica con `git status -sb`, no se asume por esta decisión.

---

## DEC-006 — Migración a pnpm

**Status:** Accepted

**Context:**
El proyecto se inició con npm (`package-lock.json` generado por `create-next-app`). Se decidió adoptar pnpm como package manager del proyecto.

**Decision:**
Usar pnpm como único package manager del proyecto, gestionado vía Corepack. `package-lock.json` fue eliminado y reemplazado por `pnpm-lock.yaml`; se agregó `pnpm-workspace.yaml` (con la aprobación de build scripts requerida por pnpm). El campo `packageManager` en `package.json` fija la versión exacta. Todos los comandos documentados del proyecto (instalación, desarrollo, build, start, lint) usan pnpm.

**Rationale:**
Estandarizar el package manager del proyecto antes de comenzar la implementación funcional.

**Consequences:**
- `pnpm-lock.yaml` es el lockfile vigente; ya no existe `package-lock.json`.
- `pnpm-workspace.yaml` debe conservarse (necesario para reproducir la instalación).
- Esta decisión ya está implementada y commiteada (`497a5a6 — chore: migrate project to pnpm`).

---

## DEC-007 — Estado global y persistencia del carrito

**Status:** Accepted — implementado y validado

**Context:**
El reto requiere un estado global del carrito, accesible desde la PDP (acción "Agregar al carrito") y desde el Header (contador de ítems), con persistencia del carrito y compatibilidad con la arquitectura Server Components / Client Components definida en [ARCHITECTURE.md](./ARCHITECTURE.md). El estado mutable del carrito pertenece necesariamente al cliente: los Server Components no pueden mantener estado interactivo ni reaccionar a eventos de usuario.

**Alternativas consideradas:**
- **Context API + `useReducer`:** solución válida, sin dependencia externa, con un reducer explícito y testeable. Se descartó como recomendación (no como inválida) por requerir más código propio para implementar persistencia y rehidratación, incluyendo construir manualmente la señal/gestión del estado de hidratación.
- **Zustand (elegida):** menor boilerplate para un store global, con selectors y una separación clara entre el store y sus consumidores; adecuado para un único dominio de estado acotado como el carrito.
- **Redux Toolkit / Jotai / Valtio:** descartadas por no aportar ventaja diferencial para un solo dominio de estado acotado como el carrito — habrían introducido más complejidad o una abstracción distinta sin una necesidad real que lo justifique en este alcance.

**Decision (final, implementada):**
Usar Zustand para el estado global del carrito (`lib/cart/store.ts`), con el middleware `persist` sobre `localStorage` para la persistencia, y un flag `hasHydrated` en el estado para controlar explícitamente cuándo mostrar el valor real del contador.

Justificación precisa (sin sobreafirmar lo que la librería resuelve):
- Zustand simplifica la gestión del estado global en sí (menos boilerplate que Context + `useReducer`, selectors sin esfuerzo manual).
- `persist` simplifica la mecánica de serialización y lectura del estado persistido (evita escribir a mano el guardado/lectura de `localStorage`).
- `localStorage` es suficiente para el alcance actual: no se requiere sincronización entre dispositivos ni backend propio (ver DEC-004), solo persistencia dentro del mismo navegador del usuario.
- `localStorage` sigue siendo exclusivamente client-side: el servidor no puede acceder a ese valor. El render inicial parte de un estado por defecto (carrito vacío); la rehidratación ocurre después, en el cliente.
- `persist` facilita la mecánica de persistencia/rehidratación, pero **no elimina** la responsabilidad de manejar conscientemente el estado de hidratación — eso se resolvió explícitamente con el flag `hasHydrated` (ver "Problema encontrado durante implementación" más abajo).

**Arquitectura:**
- Se mantiene el enfoque server-first ya definido en [ARCHITECTURE.md](./ARCHITECTURE.md): PLP y PDP permanecen principalmente como Server Components.
- `CartCounter` (en el Header) y `AddToCartButton` son las únicas islas Client Component que conocen el store.
- El store (`lib/cart/store.ts`) no debe importarse desde ningún Server Component.

**Problema encontrado durante implementación:**
`onRehydrateStorage` referenciaba inicialmente el binding exportado `useCartStore` durante la propia inicialización del store. Debido a que la rehidratación con `localStorage` se resuelve de forma síncrona, esa referencia se evaluaba antes de que la asignación de `useCartStore` terminara, lo que producía una violación de Temporal Dead Zone. La excepción resultante era absorbida silenciosamente por la cadena interna de `persist`, dejando `hasHydrated` permanentemente en `false` — aunque los datos persistidos sí se recuperaban correctamente, por lo que `items`/el conteo interno existían mientras el contador permanecía visualmente vacío. La corrección fue capturar la referencia `set` dentro de la función creadora del store y usarla en `onRehydrateStorage`, evitando referenciar `useCartStore` durante su propia inicialización.

**Validación:**
- `pnpm lint` → sin errores.
- `pnpm build` → exitoso, TypeScript estricto sin errores.
- Persistencia comprobada manualmente en navegador: agregar producto, refrescar la página, y el contador recupera la cantidad correcta tras la hidratación.
- Flujo completo validado: agregar al carrito → persistir en `localStorage` → reload → rehidratar → mostrar contador actualizado.

**Consequences:**
- Zustand queda incorporado como dependencia del proyecto (`zustand` en `package.json`).
- El componente del contador en el Header maneja explícitamente el estado de hidratación (antes/después de leer `localStorage`).
- `localStorage` permite conservar el carrito entre refresh y cierre/reapertura del navegador (mismo origen).

**Límites de esta decisión (lo que sigue sin decidirse):**
- Sincronización entre pestañas — no implementada, sigue fuera de alcance.
- `clearCart` — no forma parte del alcance actual.
- Estructura definitiva de carpetas por dominio — sigue abierta (ver [ARCHITECTURE.md](./ARCHITECTURE.md)).
- Estrategia/framework de testing — sigue abierto.

---

## DEC-008 — Estrategia de acceso y consumo de datos

**Status:** Accepted — acceso a datos server-side con Server Components y capacidades nativas de Next.js. La política concreta de caché y revalidación queda pendiente de una decisión específica posterior.

**Context:**
El PLP (`/products`) y la PDP (`/products/[id]`) necesitan datos de Fake Store API (DEC-004), y el estado de filtros del PLP vive en la URL (ver [ARCHITECTURE.md](./ARCHITECTURE.md), "Contrato conceptual del PLP"). Había que decidir si el acceso ocurre en servidor o en cliente, qué herramienta lo gestiona y qué resiliencia exige.

Hechos conocidos:
- Next.js 16.3.8, sin Cache Components (`next.config.ts` sin `cacheComponents`). Según la guía de Next incluida en `node_modules`, `fetch` sin opciones de caché no cachea en servidor (`auto no cache`); `cache: 'force-cache'` y `next.revalidate` son opt-in.
- Los `searchParams` son una `Promise` y leerlos vuelve la página dinámica en tiempo de request.
- Dentro de un mismo render, `fetch` con la misma URL y opciones se memoiza.
- En desarrollo, la caché HMR puede mostrar datos antiguos entre refrescos.
- Fake Store API no ofrece búsqueda ni ordenamiento en sus endpoints: el filtrado y el orden ocurren fuera de la API.
- Observación del 2026-10-04: durante la auditoría, Fake Store API respondió HTTP 522 en `/products` y `/products/categories`, en varios intentos. No hay medición de disponibilidad histórica.
- El estado del carrito ya vive en cliente con Zustand (DEC-007). No es caché de datos de catálogo.

**Alternativas evaluadas:**
- **A. `fetch` nativo de Next.js dentro de Server Components (elegida).** Encaja con el modelo server-first, renderiza el contenido en el HTML inicial y no añade dependencias. La política de caché (`cache`, `next.revalidate`, etiquetas) es una capa adicional de Next.js que se decidirá aparte.
- **B. React Query (TanStack Query) (no incorporada en esta fase).** Resuelve caché de cliente, deduplicación, refetch y estados de carga en el navegador. Exige Client Components y un provider, y mueve la lectura del catálogo al cliente. Ver la justificación de la sección siguiente.

**Decision:**
1. El catálogo (PLP) y el detalle de producto (PDP) obtienen sus datos en el servidor, desde Server Components, usando las capacidades nativas de Next.js.
2. Los filtros, la búsqueda y el ordenamiento del PLP se representan mediante URL Search Params. La URL es la fuente de verdad del estado de navegación.
3. React Query **no** se incorpora en esta fase.
4. El carrito se mantiene como client state, gestionado con la decisión ya aceptada [DEC-007](#dec-007--estado-global-y-persistencia-del-carrito) (Zustand + `persist`). El server state del catálogo y el client state del carrito son categorías distintas y no se mezclan: el catálogo no se guarda en el store del carrito, y el carrito no se consulta desde Server Components.
5. La estrategia concreta de `cache` y revalidación queda **pendiente** y se decidirá cuando haya una necesidad real de frescura del catálogo que la justifique. Este registro no fija ningún valor de `revalidate`.
6. Los errores de la API se normalizan en la capa de acceso a datos y se exponen a la aplicación como estados controlados (ver [ARCHITECTURE.md](./ARCHITECTURE.md), "Estados esperados del PLP").
7. Se distingue siempre entre respuesta válida sin productos (Empty State) y fallo de API, incluyendo timeout, 5xx y 522 (Error State).
8. Un fallback de demostración explícito queda documentado como **iniciativa de resiliencia**, no como decisión de datos. Cumple estas restricciones: no es silencioso (la UI indica que los datos no son los de la API), no escribe ni persiste datos en nombre de la API real, no añade un campo de origen al modelo `Product`, y no sustituye a la API de forma permanente.

**Rationale:**
La elección se basa en los requisitos del reto, no en preferencia personal ni en la simplicidad del proyecto:
- El reto exige carga y procesamiento inicial del PLP con Server Components, y filtros, búsqueda y orden en URL Search Params. Con esto, el listado se renderiza en servidor y es enlazable y compartible.
- El SEO depende de que el contenido esté en el HTML inicial, lo que favorece `fetch` en servidor frente a lecturas en cliente.
- Los requisitos actuales no demandan las capacidades que justifican React Query: gestión de server state en cliente, polling, refetch automático complejo, mutations remotas (Fake Store API solo expone `GET`, según DEC-004), infinite queries, invalidación compleja de caché en cliente, o sincronización de server state entre varios Client Components.
- Incorporar React Query ahora añadiría un provider, una frontera de Client Components para el catálogo, una segunda capa de caché que duplica la del servidor y complejidad de hidratación, sin resolver un problema que hoy exista.
- La resiliencia es requisito real: la API respondió HTTP 522 durante la evaluación del 2026-10-04. Por eso el manejo de errores se normaliza en la capa de acceso a datos, y no depende de la librería elegida.

**Reconsideración de React Query:** se volverá a evaluar solo si aparecen requisitos concretos, por ejemplo búsqueda reactiva sin navegación que deba consultar la API, polling o refetch periódico, escrituras remotas (checkout o similares), scroll infinito, o varios Client Components que necesiten compartir el mismo server state. En ese caso se abrirá una decisión nueva que supersedería esta parte.

**Consequences:**
- El acceso a datos del PLP y de la PDP se implementa en Server Components y en la capa de acceso a datos, sin hooks de fetching en cliente.
- La política de caché y revalidación se registra en una decisión específica posterior, con su valor justificado según la frescura necesaria del catálogo.
- La capa de acceso a datos debe normalizar: respuesta válida con cero productos (Empty), y fallo de red, timeout, 5xx o 522 (Error).
- El fallback de demostración, si se implementa, es una iniciativa de resiliencia (💡 en [CHECKLIST.md](./CHECKLIST.md)) con las restricciones del punto 8.
- La lógica de dominio (normalización, filtrado, orden) no depende de esta decisión y se diseña de forma independiente.

---

## Plantilla para futuras decisiones

Usar este formato al registrar cada una de las siguientes decisiones pendientes (ver [ARCHITECTURE.md](./ARCHITECTURE.md) para el contexto de cada una):

- Estrategia de testing.
- Server vs. Client Components (reglas específicas por componente).
- Estructura final de carpetas por dominio.

```markdown
## DEC-XXX — <título>

**Status:** Proposed | Accepted | Superseded

**Context:**
...

**Decision:**
...

**Rationale:**
...

**Consequences:**
...
```
