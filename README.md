# Delosi Ecommerce — Reto Técnico 2026

## Descripción

Implementación del reto técnico propuesto por Delosi para 2026: una mini aplicación de e-commerce construida sobre Next.js (App Router), que incluye un listado de productos (PLP) con filtrado/búsqueda/orden persistidos en la URL, una página de detalle de producto (PDP) con metadata dinámica (título, descripción) y Open Graph, y un carrito de compras con estado global reflejado en el Header. Los datos provienen de [Fake Store API](https://fakestoreapi.com/).

## Objetivo

Demostrar una arquitectura modular, escalable y mantenible en Next.js, aplicando buenas prácticas de performance, SEO y UX —los tres pilares de evaluación explícitos del reto—, además de resiliencia ante fallos, TypeScript estricto y principios SOLID/Clean Code, con una sustentación posterior mediante code review.

## Stack actual

Lo siguiente está verificado en el repositorio:

- **Next.js** 16.3.8 (App Router, carpeta `app/`)
- **React** 19.2.8
- **TypeScript** 5.x, con `strict: true` en `tsconfig.json`
- **Tailwind CSS** v4 (vía `@tailwindcss/postcss`, importado en `app/globals.css`)
- **ESLint** 9.x con `eslint-config-next` (`core-web-vitals` + `typescript`)
- **pnpm** como package manager del proyecto (migrado desde npm), fijado vía Corepack en `package.json`: `"packageManager": "pnpm@12.8.1+sha512.f64ba907507f5ceafe06c8d38e6052d0179444580ec1279ddd5bfc11cb48aa8a2644b66598e07e761da84872a9fc57d5f902b87fa49d024198d558612aabbe45"`
- **Zustand** 5.x con middleware `persist` (estado global del carrito, [DEC-007](docs/DECISIONS.md))
- Repositorio Git inicializado, con commit inicial (`Initial commit from Create Next App`)
- Remoto de GitHub configurado (`origin`), repositorio público. El 2026-10-04 la rama local `main` tenía commits pendientes de subir a `origin/main`; confirmar el estado actual con `git status -sb`

> Cualquier otra librería, patrón o herramienta mencionada en este documento fuera de esta lista y de las decisiones registradas en [docs/DECISIONS.md](docs/DECISIONS.md) **no está instalada ni implementada todavía**. Ver [docs/DECISIONS.md](docs/DECISIONS.md) para decisiones pendientes y [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el espacio de decisión arquitectónica.

## Requisitos para ejecutar localmente

- Node.js 22 o superior (compatible con Next.js 16 / React 19; los tests usan `--experimental-strip-types`, disponible en Node 22)
- pnpm (gestor de paquetes usado por el proyecto; ver `pnpm-lock.yaml` y el campo `packageManager` en `package.json`). Se recomienda habilitarlo vía Corepack (`corepack enable`), incluido con Node.js.

## Comandos básicos

```bash
# Instalar dependencias
pnpm install

# Levantar entorno de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Levantar build de producción
pnpm start

# Lint
pnpm lint

# Typecheck
pnpm exec tsc --noEmit

# Tests (ver sección Testing)
pnpm test
```

La aplicación en desarrollo queda disponible en [http://localhost:3000](http://localhost:3000). `pnpm start` sirve el build de producción en el mismo puerto por defecto; en producción la aplicación usa siempre Fake Store API, aunque `PRODUCTS_DATA_SOURCE` esté definido.

La versión desplegada en Vercel está disponible en `https://delosi-ecommerce-eight.vercel.app`. Mientras Fake Store API no responda, el catálogo muestra su estado de error; ver [Lighthouse en producción](#lighthouse-en-producción-primera-medición).

## Datos de desarrollo (fixtures)

Por defecto la aplicación usa Fake Store API (`live`). Para trabajar sin la API, activa los fixtures solo en desarrollo:

PowerShell:

```powershell
$env:PRODUCTS_DATA_SOURCE="fixtures"; pnpm dev
```

Git Bash:

```bash
PRODUCTS_DATA_SOURCE=fixtures pnpm dev
```

Para volver al modo live, arranca el servidor sin la variable (`pnpm dev`). En producción la aplicación usa siempre Fake Store API. Los fixtures no son un requisito de producción y no son un fallback: si Fake Store API falla, la aplicación muestra el estado de error correspondiente.

## Estructura inicial del proyecto

```
delosi-ecommerce/
├── app/                # App Router (layout, page redirige a /products; (catalog)/products PLP; products/[id] PDP)
├── components/         # Componentes React (Header, CartCounter, AddToCartButton, products/)
├── lib/                # Lógica compartida (cart/ con Zustand, products/ con la capa de datos)
├── public/              # Assets estáticos (incluye fixtures de imágenes)
├── tests/               # Tests con node:test (catálogo y carrito)
├── docs/                 # Documentación técnica del reto
│   ├── CHECKLIST.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

> Estructura actual: bootstrap, carrito (DEC-007), PLP y PDP. Su diseño conceptual está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## API pública utilizada

[Fake Store API](https://fakestoreapi.com/):

- `GET /products` — listado de productos (PLP)
- `GET /products/categories` — categorías para filtrado (PLP)
- `GET /products/{id}` — detalle de producto (PDP)

## Estado del proyecto

**Fase actual: checkpoint documental tras PLP, PDP, fixtures, optimización LCP y carrito.** La validación contra Fake Store API real sigue pendiente porque el servicio no ha estado disponible.

- Implementado: bootstrap de Next.js y estado global del carrito con contador en el Header (DEC-007), validado con fixtures y con persistencia comprobada. Tests permanentes del carrito en `tests/cart.test.ts` (15/15). La demo temporal de `app/page.tsx` fue retirada: `/` redirige de forma permanente a `/products`.
- Implementado en `lib/products/` y en la UI: contrato de URL del PLP (`category`, `q`, `sort`), parser, modelo `Product`, capa de acceso a datos con caché de 3600 s y normalización de errores ([DEC-010](docs/DECISIONS.md)). Pendiente de validación contra la API real.
- Implementado: UI del PLP (búsqueda, categoría y orden desde la URL) y estados success, empty y error. Validado visualmente con fixtures en desktop y mobile. Pendiente: validación de success y empty con datos reales de Fake Store API, y retry manual.
- Implementado: fixtures de desarrollo y test (`PRODUCTS_DATA_SOURCE=fixtures`, solo fuera de producción; ver [DEC-011](docs/DECISIONS.md)) y optimización LCP de las 4 primeras tarjetas del PLP ([DEC-012](docs/DECISIONS.md)).
- Limitación conocida: Fake Store API respondió HTTP 521 y 522 durante la validación del 2026-10-04 (evidencia y detalle en [DEC-011](docs/DECISIONS.md#dec-011--fixtures-explícitos-de-desarrollo-y-test)). Las validaciones con datos reales están pendientes de que el servicio vuelva a responder.
- Implementado: PDP `/products/[id]` con metadata dinámica, página not-found y `AddToCartButton` sobre el store existente. Pendiente: validación del estado success con datos reales.
- Decidido: acceso a datos server-side con Server Components y capacidades nativas de Next.js; React Query no se incorpora en esta fase ([DEC-008](docs/DECISIONS.md)).
- Decidido: caché de datos y revalidación de 3600 segundos para productos y categorías ([DEC-009](docs/DECISIONS.md)). Implementado en `lib/products/fake-store/client.ts`. Verificación en runtime pendiente.
- Implementado: `loading.tsx` con skeleton para el PLP (la PDP no tiene skeleton propio, para mantener el 404 real). Validado estructuralmente; la validación visual del skeleton, el foco durante navegación de filtros y el CLS real están pendientes.
- Pendiente de decisión: herramienta de testing definitiva (hoy `node:test`, sin dependencias nuevas).
- Sin implementar: Suspense granular, `error.tsx`, retry manual y fallback de demostración.

Los documentos en `docs/` definen el alcance, registran las decisiones tomadas y las pendientes, y sirven de checklist de avance.

## Requisitos del reto

Resumen del alcance funcional y técnico exigido por el reto (fuente: *Reto Técnico 2026 - DELOSI.pdf*):

- **PLP**: Server Components para carga inicial, filtrado por categoría, filtros persistidos en Search Params de la URL, búsqueda por texto y/o ordenamiento por criterio de negocio.
- **PDP**: ruta dinámica `/products/[id]`, metadata dinámica (título y descripción), Open Graph, botón "Agregar al carrito".
- **Carrito**: estado global, contador de ítems reflejado en el Header.
- **Criterios técnicos**: performance, SEO y UX, optimización de imágenes externas, lazy loading, prevención de layout shift, arquitectura modular por dominio, TypeScript estricto, SOLID/Clean Code, escalabilidad, justificación de la estrategia de estado del carrito, testing (unitario y/o integración).
- **Iniciativas de proactividad sugeridas**: streaming + Suspense + skeletons, resiliencia ante fallos de API (`error.js`), empty states, caché/revalidación avanzada.
- **Entregables**: repositorio público, README con lineamientos técnicos e instrucciones de ejecución local, sustentación mediante code review de arquitectura, performance y diseño.

Ver detalle completo y seguimiento en [docs/CHECKLIST.md](docs/CHECKLIST.md).

## Arquitectura resumida

- **Catálogo (server state):** `/products` y `/products/[id]` son Server Components. `/products` lee los `searchParams`, los parsea con `parseProductsQuery` y consulta `getProducts`/`getCategories`. `/products/[id]` consulta `getProduct`. La capa de datos vive en `lib/products/`: Fake Store API → DTO validado → mapper → `Product`. Las respuestas se cachean con `revalidate: 3600`.
- **Carrito (client state):** Zustand con `persist` en `localStorage["delosi-cart"]`. Lo escriben `AddToCartButton` (PDP) y lo lee `CartCounter` (Header).
- **Fuente de datos:** `live` por defecto y en producción; `fixtures` solo en desarrollo y test. Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Decisiones técnicas

El stack base (Next.js App Router, TypeScript, Tailwind CSS, Fake Store API, Git/GitHub) ya está confirmado durante este bootstrap y registrado en [docs/DECISIONS.md](docs/DECISIONS.md). Además, ya existen decisiones iniciales de diseño/arquitectura — como el enfoque Server-first con Server Components para la carga inicial, la integración con Fake Store API y la separación conceptual entre UI, dominio/servicios y acceso a datos —, documentadas con su contexto en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Esto no implica que todas las decisiones de implementación del reto estén cerradas: el estado del carrito quedó decidido e implementado ([DEC-007](docs/DECISIONS.md)); el acceso a datos del PLP está decidido en server-side ([DEC-008](docs/DECISIONS.md)) y la política de caché y revalidación de 3600 segundos está decidida ([DEC-009](docs/DECISIONS.md)); los fixtures de desarrollo ([DEC-011](docs/DECISIONS.md)) y la optimización LCP ([DEC-012](docs/DECISIONS.md)) están decididos e implementados; la herramienta de testing y la estructura final de carpetas por dominio siguen pendientes. El contrato conceptual del PLP está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Testing

Tests permanentes con el runner nativo de Node (`node:test`), sin dependencias nuevas: catálogo (19) y carrito (15), 34/34 en verde. La herramienta de testing definitiva sigue pendiente de decisión.

```bash
pnpm test
```

El script ejecuta `node --experimental-strip-types --import ./tests/register.mjs --test tests/products.test.ts tests/cart.test.ts`. Requiere Node 22 o superior.

Pendiente de definición. El reto sugiere Jest, React Testing Library, Cypress o Playwright como herramientas posibles. La estrategia definitiva (unitario vs. integración, alcance, herramienta) se registrará en [docs/DECISIONS.md](docs/DECISIONS.md) cuando se tome.

## Performance

Parcialmente implementado: `next/image` con dimensiones fijas (sin layout shift), optimización LCP del primer bloque del PLP ([DEC-012](docs/DECISIONS.md)) y caché de datos con `revalidate: 3600`. Pendiente de validación con datos reales.

### Lighthouse en producción (primera medición)

Medición de la aplicación desplegada en Vercel (`https://delosi-ecommerce-eight.vercel.app/products`), realizada el 2026-10-04 mientras Fake Store API respondía 521/522. La página mostraba el estado de error ("No se pudo cargar el catálogo"), no el catálogo, así que **estos valores no representan el rendimiento del catálogo real**.

| Modo | Performance | Accessibility | Best Practices | SEO | LCP / CLS / TBT / FCP |
|---|---|---|---|---|---|
| Mobile | 92 | 100 | 100 | 100 | no visible en evidencia |
| Desktop | 100 | 100 | 100 | 100 | no visible en evidencia |

Evidencia: [lighthouse-mobile.png](docs/evidence/lighthouse-mobile.png) y [lighthouse-desktop.png](docs/evidence/lighthouse-desktop.png). La medición del catálogo real queda pendiente hasta que Fake Store API responda.

## Iniciativas de proactividad

Parcialmente implementado: skeleton con `loading.tsx` en el PLP (`app/(catalog)/products/`); la PDP no tiene skeleton propio para mantener el HTTP 404 real en IDs inválidos (validación visual pendiente). Pendiente: Suspense granular, manejo de errores con `error.tsx`, empty states elaborados y caché avanzada.
