# Checklist — Reto Técnico 2026 DELOSI

Fuente de verdad del alcance: requisitos del reto Delosi (*Reto Técnico 2026 - DELOSI*) incorporados al proyecto.

Este documento es el **checklist operativo** del reto: se actualiza durante todo el desarrollo y debe reflejar siempre el estado real, no solo lo planificado. No es documentación estática — es la fuente de seguimiento.

> Este formato de estados reemplaza la convención anterior (`[ ]` / `[~]` / `[x]` / `[✓]` / `[!]`) por un estado visual único por ítem.

## Convención de estados

| Estado | Significado |
|---|---|
| 🟢 | **Completado / validado** — implementado y verificado |
| 🟡 | **En progreso** — actualmente en implementación |
| 🔵 | **Planificado** — decisión tomada / trabajo previsto, todavía sin implementar |
| ⚪ | **Pendiente** — todavía no iniciado ni decidido |
| 🔴 | **Bloqueado / requiere atención** |
| 💡 | **Iniciativa / propuesta adicional** — no forma parte del mínimo obligatorio |

> Reglas: nunca se marca 🟢 algo que no esté implementado **y** verificado en código real. Una decisión ya tomada pero sin código todavía es 🔵, no 🟢. Las iniciativas adicionales (💡) nunca se presentan como obligatorias ni se mezclan con los requisitos mínimos.

---

## 1. Requisitos funcionales mínimos

### PLP (Product Listing Page)

| Ítem | Estado | Nota |
|---|---|---|
| Server Components para carga/procesamiento inicial | 🟡 | Implementado en `app/products/page.tsx`; éxito con datos reales pendiente de Fake Store API |
| Filtrado por categoría | 🟡 | Implementado en `ProductFilters`; la selección con datos reales está bloqueada por Fake Store API (`getCategories`) |
| Búsqueda por texto | 🟡 | Implementado en `ProductFilters` (`q`) y verificado por URL; resultados con datos reales pendientes |
| Ordenamiento por criterio de negocio | 🟡 | Mecanismo: URL Search Params (`sort`). Criterio aprobado: precio, `price-asc` y `price-desc` ([DEC-010](./DECISIONS.md)). Implementado en `lib/products/apply-query.ts` y en la UI (`ProductFilters`) |
| Integración `GET /products` | 🟡 | Implementada en `lib/products/catalog.ts` ([DEC-008](./DECISIONS.md)); validación contra la API real pendiente (la API respondió 522 durante la verificación) |
| Integración `GET /products/categories` | 🟡 | Implementada en `lib/products/catalog.ts` ([DEC-008](./DECISIONS.md)); validación contra la API real pendiente |
| Normalización de errores de API en estados controlados (error, empty) | 🟡 | Implementada en `lib/products/fake-store/client.ts`; probada con servidor local y fetch simulado |
| Ruta `/products` y contrato de URL (`category`, `q`, `sort`) | 🟡 | Implementado ([DEC-010](./DECISIONS.md)): `app/products/page.tsx`, parser y `buildProductsHref`; éxito con datos reales pendiente |
| Parser de query params (`parseProductsQuery()`) | 🟡 | Implementado en `lib/products/parse-query.ts`; probado con casos de borde |
| Capa de acceso a datos (`getProducts`, `getCategories`) | 🟡 | Implementada en `lib/products/catalog.ts`; validación contra la API real pendiente |
| Modelo de dominio `Product` independiente del DTO de Fake Store API | 🟡 | Implementado en `lib/products/types.ts` y `lib/products/fake-store/mapper.ts` |
| Estados del PLP (loading, success, empty, error) | 🟡 | success y empty implementados, pendientes de validar con datos reales; error validado en runtime; `loading.tsx` implementado en PLP y PDP (validación visual pendiente) |
| Tarjetas de producto `ProductCard` con `next/image` | 🟡 | Implementado en `components/products/ProductCard.tsx`; render con datos reales pendiente |
| Retry manual desde la UI en estado error | 🔵 | Diseño documentado; sin retries automáticos; sin código |

### PDP (Product Detail Page)

| Ítem | Estado | Nota |
|---|---|---|
| Ruta dinámica `/products/[id]` | 🟡 | Implementada (`app/products/[id]/page.tsx`); estado success con datos reales pendiente |
| Página 404 para producto inexistente | 🟡 | Implementada (`not-found.tsx`); validada en runtime: HTTP 404 y título propio |
| Estado de error diferenciado de la PDP | 🟡 | Implementado; validado en runtime con la API caída. Nunca se convierte en 404 ni en producto vacío |
| Metadata dinámica — título | 🟡 | Implementada en `generateMetadata()`; metadata de producto real pendiente de validar |
| Metadata dinámica — descripción | 🟡 | Implementada en `generateMetadata()`; pendiente de validar con producto real |
| Open Graph | 🟡 | Implementado (`title`, `description`, `image` = `imageUrl`, `type: website`); pendiente de validar con producto real. Ver punto ambiguo #3 |
| Botón "Agregar al carrito" | 🟡 | Reutiliza `AddToCartButton` sobre el store existente; store validado; clic real en la PDP pendiente de datos reales |
| Integración `GET /products/{id}` | 🟡 | Implementada en `lib/products/product.ts`; validación con la API real pendiente, incluido el caso `200 + null` |

> Nota: la metadata dinámica y Open Graph de la PDP cumplen a la vez el criterio de SEO del reto; no se duplica como sección aparte para evitar redundancia.

### Carrito

| Ítem | Estado | Nota |
|---|---|---|
| Estado global del carrito | 🟢 | Implementado con Zustand (`lib/cart/store.ts`) y validado manualmente — ver [DEC-007](./DECISIONS.md) |
| Contador de ítems reflejado en el Header | 🟢 | Implementado (`CartCounter`) y validado manualmente, incluyendo recuperación tras refresh |

> Nota: validado hasta ahora mediante la superficie de demostración temporal en `app/page.tsx` La PDP `/products/[id]` ya existe; el clic real en su botón "Agregar al carrito" queda pendiente de validar con datos reales de la API.

---

## Estado del checkpoint PLP + PDP

Fake Store API no estaba disponible durante este checkpoint (HTTP 521/522). Las validaciones que requieren datos reales quedan pendientes; no se han sustituido por fixtures, mocks ni fallbacks.

| Validación | Estado |
|---|---|
| `pnpm lint` | PASS |
| `pnpm exec tsc --noEmit` | PASS |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| `getProduct` (12 casos, `fetch` simulado) | PASS |
| PLP visual desktop y mobile (estado de error, API caída) | PASS |
| PDP: 404 para ids no válidos y HTTP 404 en `not-found.tsx` | PASS |
| PDP: metadata del not-found no usa el título genérico del layout | PASS |
| PDP: estado de error sin convertirlo en 404 ni en producto vacío | PASS (API caída) |
| Carrito: primera adición, incremento, persistencia (store sin cambios) | PASS (validado con el store compilado) |
| Validación visual de la PDP en estado success | PENDIENTE (requiere datos reales) |
| Validación visual de la PLP con fixtures (success, empty, filtros, orden, responsive) | PASS (fixtures) |
| Validación de la PLP contra Fake Store API real (success, empty, categorías) | PENDIENTE (API caída) |
| Comportamiento real de Fake Store ante `200 + null` | PENDIENTE (requiere la API) |
| Clic real en "Agregar al carrito" de la PDP y contador del header | PENDIENTE (requiere datos reales) |
| Verificación en runtime de la Data Cache ante fallo de revalidación | PENDIENTE (requiere la API) |

> Fake Store API se encuentra temporalmente no disponible durante este checkpoint, por lo que las validaciones que requieren datos reales de éxito quedan pendientes hasta que el servicio vuelva a responder.

## Bloque fixtures, validación visual del PLP y LCP

Esta sección separa la validación con fixtures de la validación contra Fake Store API real. Los fixtures no demuestran que la integración live funcione.

**Validación con fixtures (desarrollo y test)**

| Ítem | Estado | Nota |
|---|---|---|
| Fixtures de desarrollo/test explícitos (`PRODUCTS_DATA_SOURCE=fixtures`, fuera de producción) | 🟢 | Ver [DEC-011](./DECISIONS.md) |
| Producción fuerza `live` aunque la variable esté definida | 🟢 | Ver [DEC-011](./DECISIONS.md) |
| Fixtures pasan por el mismo guard DTO y el mismo mapper | 🟢 | Sin fallback automático |
| 8 productos fixture e imágenes locales (`public/fixtures/products/`) | 🟢 | Imágenes locales; no sustituyen las de Fake Store |
| PLP visual con fixtures: success, cards, imágenes, responsive desktop y mobile | 🟢 | Validado visualmente |
| Filtros, búsqueda y orden con fixtures | 🟢 | Validación reportada |
| Add to Cart con el mismo `Product` | 🟢 | Validación reportada |
| Optimización LCP: `priority` en las 4 primeras tarjetas ([DEC-012](./DECISIONS.md)) | 🟢 | Aviso de LCP resuelto |
| Tests del catálogo: 19/19 | 🟢 | Runner `node:test`, sin dependencias nuevas |
| PDP visual con fixtures | 🟡 | Pendiente de confirmación |
| Navegación Back/Forward y refresh con fixtures | 🟡 | No reportado como validado |

**Validación contra Fake Store API real (pendiente)**

| Ítem | Estado | Nota |
|---|---|---|
| PLP con datos reales: success, empty y categorías | ⚪ | La API continúa caída |
| PDP con datos reales (success y metadata real) | ⚪ | La API continúa caída |
| Comportamiento real ante `200 + null` | ⚪ | Pendiente de verificar |
| Clic real en "Agregar al carrito" con datos reales | ⚪ | Pendiente |
| Data Cache ante fallo de revalidación | ⚪ | Pendiente |

## 2. Requisitos técnicos / arquitectura

### Stack base (bootstrap)

| Ítem | Estado | Nota |
|---|---|---|
| Next.js + App Router | 🟢 | Verificado en el repositorio real |
| TypeScript (`strict: true`) | 🟢 | Verificado en `tsconfig.json` |
| Tailwind CSS | 🟢 | Verificado en `app/globals.css` / `postcss.config.mjs` |
| ESLint | 🟢 | Verificado en `eslint.config.mjs` |
| Git repository + commit inicial | 🟢 | — |
| Remoto GitHub + push inicial | 🟢 | Push inicial (`fb9d8a4`) realizado. En la última verificación (2026-10-04) `main` coincidía con `origin/main`; confirmar con `git status -sb` antes de asumirlo |

### Arquitectura y organización del código

| Ítem | Estado | Nota |
|---|---|---|
| Arquitectura modular / orientada a dominio (principio) | 🔵 | Principio adoptado; aplicación concreta en código pendiente |
| Separación Server Components / Client Components (reglas generales) | 🔵 | Server-first decidido; límites exactos por sub-componente pendientes de implementación |
| Escalabilidad y colaboración entre desarrolladores | 🔵 | Objetivo de diseño adoptado; se valida con la implementación y el code review |
| SOLID / Clean Code | 🔵 | Principio adoptado como guía de implementación; ver punto ambiguo #2 |
| Estructura final de carpetas por dominio | ⚪ | Decisión abierta — ver [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Estrategia de acceso a datos del PLP (Server Components + capacidades nativas de Next.js; React Query no incorporado) | 🟡 | Decidido en [DEC-008](./DECISIONS.md); implementado en `lib/products/` |

### Estado del carrito (decidido e implementado)

| Ítem | Estado | Nota |
|---|---|---|
| Tecnología de estado global | 🟢 | Zustand — ver [DEC-007](./DECISIONS.md) |
| Estrategia de persistencia | 🟢 | `localStorage` vía middleware `persist` — ver [DEC-007](./DECISIONS.md) |
| Justificación formal de la estrategia elegida | 🟢 | Documentada en [DEC-007](./DECISIONS.md) |

---

## 3. Calidad, testing y performance

### Performance

| Ítem | Estado | Nota |
|---|---|---|
| Optimización de imágenes externas | 🔵 | Vía `next/image`, ya disponible en el stack decidido; sin implementar |
| Lazy loading | 🔵 | Vía `next/image` / carga diferida de componentes; sin implementar |
| Prevención de layout shift | 🔵 | Vía dimensionado explícito de imágenes (`next/image`); sin implementar |
| Política de caché y revalidación del catálogo (3600 s) | 🟡 | Decidido en [DEC-009](./DECISIONS.md); implementado en `lib/products/fake-store/client.ts` mediante `next.revalidate` |
| Implementación de caché en `getProducts` y `getCategories` | 🟡 | Aplicada en `fetchFakeStoreJson`, que usan ambas funciones; comportamiento de Data Cache en runtime pendiente de verificación |
| Verificación del comportamiento de caché ante fallo de revalidación y de errores no cacheados | ⚪ | Pendiente; se verifica durante la implementación |

> Nota: la configuración **avanzada** de caché/políticas de revalidación es una iniciativa de proactividad adicional (ver sección 5), distinta de la estrategia básica de arriba, que sí forma parte del alcance mínimo.

> Nota UX: performance (CLS, lazy loading, optimización de imágenes) es, junto con SEO, uno de los pilares de evaluación del reto (ver [README.md](../README.md) y [ARCHITECTURE.md](./ARCHITECTURE.md)). Los ítems de esta sección contribuyen directamente a la experiencia de usuario, no solo a métricas técnicas.

### Testing

| Ítem | Estado | Nota |
|---|---|---|
| Estrategia definitiva de testing (alcance y herramienta) | ⚪ | Ver punto ambiguo #4 |
| Testing unitario | ⚪ | — |
| Testing de integración / e2e | ⚪ | — |

> Nota: cuando se defina la estrategia de testing, debe considerarse la cobertura de **critical business flows** del reto — como mínimo, filtrado/búsqueda de productos (PLP) y agregar productos al carrito. Esto no decide todavía framework, herramienta, cantidad de tests ni implementación concreta.

---

## 4. Documentación

### Documentos del proyecto

| Ítem | Estado | Nota |
|---|---|---|
| `README.md` | 🟡 | Vigente; se ampliará con cada entrega funcional |
| `docs/CHECKLIST.md` (este documento) | 🟢 | Documento operativo vivo, se actualiza durante todo el reto |
| `docs/ARCHITECTURE.md` | 🟢 | — |
| `docs/DECISIONS.md` | 🟢 | Se amplía con cada nueva decisión cerrada |

### Entregables del reto

| Ítem | Estado | Nota |
|---|---|---|
| Repositorio público | ⚪ | Visibilidad real del repo remoto no verificada desde este bootstrap — ver punto ambiguo #1 |
| Sustentación / Code Review (arquitectura, performance y diseño) | ⚪ | Ocurre al cierre del reto |

---

## 5. Iniciativas adicionales / proactividad

> Mejoras sugeridas por el PDF que **no** forman parte del alcance mínimo obligatorio. Ninguna se marca como implementada mientras no exista en código, y ninguna debe tratarse como requisito.

| Ítem | Estado | Nota |
|---|---|---|
| Streaming + Suspense + Skeletons | 🟡 | `loading.tsx` de PLP (`app/products/loading.tsx`) y PDP (`app/products/[id]/loading.tsx`) implementados con skeletons estructurales; sin Suspense granular. Validado estructuralmente (lint, typecheck, build, HTML de producción). **Pendiente:** validación visual desktop y mobile, comportamiento y foco durante navegación de filtros, comparación skeleton → contenido real y CLS real (requieren datos success de Fake Store API) |
| Resiliencia ante fallos de API (`error.js`) | 💡 | — |
| Fallback de demostración explícito ante fallo de API | 💡 | Iniciativa documentada en [DEC-008](./DECISIONS.md); no silencioso, no persiste datos, no altera `Product`, no sustituye a la API de forma permanente. Sin implementar |
| Empty States | 💡 | — |
| Configuración avanzada de caché / políticas de revalidación | 💡 | Distinta de la estrategia básica de caché (sección 3), que sí es parte del alcance mínimo |

---

## Puntos ambiguos identificados (pendientes de revisión)

No se interpretan unilateralmente — quedan explícitos para decidir en equipo:

1. **Visibilidad del repositorio.** No se verificó si el repositorio remoto en GitHub es público o privado; el reto exige que sea público como entregable.
2. **Verificación de SOLID/Clean Code y escalabilidad/colaboración.** El PDF los menciona como criterios de evaluación, pero no da un mecanismo de verificación individual — ¿se evalúan ítem por ítem o transversalmente en el code review final?
3. **Alcance de Open Graph en la PDP.** No está claro si basta con título/descripción/URL dinámicos, o si se espera también una imagen OG específica por producto.
4. **Alcance de "testing unitario o integración".** El PDF usa un conector disyuntivo ("o"); no aclara si basta con un solo tipo de testing o si se espera cobertura mínima de ambos.
