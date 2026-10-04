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
| Server Components para carga/procesamiento inicial | 🔵 | Decisión de arquitectura tomada (server-first, ver [ARCHITECTURE.md](./ARCHITECTURE.md)); sin código todavía |
| Filtrado por categoría | 🔵 | Mecanismo decidido: URL Search Params |
| Búsqueda por texto | 🔵 | Mecanismo decidido: URL Search Params |
| Ordenamiento por criterio de negocio | 🔵 | Mecanismo decidido: URL Search Params (`sort`). Criterio propuesto: precio asc/desc, pendiente de confirmación (ver [ARCHITECTURE.md](./ARCHITECTURE.md), contrato del PLP) |
| Integración `GET /products` | 🔵 | Acceso server-side decidido en [DEC-008](./DECISIONS.md); sin código |
| Integración `GET /products/categories` | 🔵 | Acceso server-side decidido en [DEC-008](./DECISIONS.md); sin código |
| Normalización de errores de API en estados controlados (error, empty) | 🔵 | Decidido en [DEC-008](./DECISIONS.md) y [ARCHITECTURE.md](./ARCHITECTURE.md); sin código |
| Ruta `/products` y contrato de URL (`category`, `q`, `sort`) | 🔵 | Contrato conceptual documentado en [ARCHITECTURE.md](./ARCHITECTURE.md); sin código |
| Modelo de dominio `Product` independiente del DTO de Fake Store API | 🔵 | Documentado conceptualmente; sin código |
| Estados del PLP (loading, success, empty, error) | 🔵 | Comportamiento documentado; implementación técnica pendiente |

### PDP (Product Detail Page)

| Ítem | Estado | Nota |
|---|---|---|
| Ruta dinámica `/products/[id]` | 🔵 | — |
| Metadata dinámica — título | 🔵 | — |
| Metadata dinámica — descripción | 🔵 | — |
| Open Graph | 🔵 | Ver punto ambiguo #3 al final de este documento (alcance de la imagen OG) |
| Botón "Agregar al carrito" | 🔵 | — |
| Integración `GET /products/{id}` | 🔵 | — |

> Nota: la metadata dinámica y Open Graph de la PDP cumplen a la vez el criterio de SEO del reto; no se duplica como sección aparte para evitar redundancia.

### Carrito

| Ítem | Estado | Nota |
|---|---|---|
| Estado global del carrito | 🟢 | Implementado con Zustand (`lib/cart/store.ts`) y validado manualmente — ver [DEC-007](./DECISIONS.md) |
| Contador de ítems reflejado en el Header | 🟢 | Implementado (`CartCounter`) y validado manualmente, incluyendo recuperación tras refresh |

> Nota: validado hasta ahora mediante la superficie de demostración temporal en `app/page.tsx` (sin PDP real todavía). El botón "Agregar al carrito" de la PDP (sección 1 → PDP) sigue en 🔵 hasta que exista la ruta `/products/[id]` real.

---

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
| Estrategia de acceso a datos del PLP (Server Components + capacidades nativas de Next.js; React Query no incorporado) | 🔵 | Decidido en [DEC-008](./DECISIONS.md); sin código |

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
| Política de caché y revalidación de datos del PLP | ⚪ | Pendiente de una decisión específica posterior. El acceso server-side está decidido en [DEC-008](./DECISIONS.md); no se fija ningún valor de `revalidate` |

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
| Streaming + Suspense + Skeletons | 💡 | — |
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
