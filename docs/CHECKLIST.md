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
| Ordenamiento por criterio de negocio | 🔵 | Mecanismo decidido: URL Search Params; el criterio de negocio concreto (precio, nombre, etc.) aún no se definió |
| Integración `GET /products` | 🔵 | — |
| Integración `GET /products/categories` | 🔵 | — |

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
| Estado global del carrito (concepto) | 🔵 | Concepto decidido (accesible desde PDP y Header); tecnología concreta pendiente — ver sección 2 |
| Contador de ítems reflejado en el Header | 🔵 | — |

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
| Remoto GitHub + push inicial | 🟢 | Rama `main` sincronizada con `origin/main` |

### Arquitectura y organización del código

| Ítem | Estado | Nota |
|---|---|---|
| Arquitectura modular / orientada a dominio (principio) | 🔵 | Principio adoptado; aplicación concreta en código pendiente |
| Separación Server Components / Client Components (reglas generales) | 🔵 | Server-first decidido; límites exactos por sub-componente pendientes de implementación |
| Escalabilidad y colaboración entre desarrolladores | 🔵 | Objetivo de diseño adoptado; se valida con la implementación y el code review |
| SOLID / Clean Code | 🔵 | Principio adoptado como guía de implementación; ver punto ambiguo #2 |
| Estructura final de carpetas por dominio | ⚪ | Decisión abierta — ver [ARCHITECTURE.md](./ARCHITECTURE.md) |

### Estado del carrito (decisión pendiente)

| Ítem | Estado | Nota |
|---|---|---|
| Tecnología de estado global (Context API / Zustand / Redux / otra) | ⚪ | No se asume Zustand ni ninguna otra librería todavía |
| Estrategia de persistencia (memoria / `localStorage` / cookies) | ⚪ | Decisión abierta |
| Justificación formal de la estrategia elegida | ⚪ | Se redactará en [DECISIONS.md](./DECISIONS.md) una vez decidida la tecnología |

---

## 3. Calidad, testing y performance

### Performance

| Ítem | Estado | Nota |
|---|---|---|
| Optimización de imágenes externas | 🔵 | Vía `next/image`, ya disponible en el stack decidido; sin implementar |
| Lazy loading | 🔵 | Vía `next/image` / carga diferida de componentes; sin implementar |
| Prevención de layout shift | 🔵 | Vía dimensionado explícito de imágenes (`next/image`); sin implementar |
| Estrategia básica de caché/revalidación (fetch de Next.js) | ⚪ | Política concreta (`force-cache`, `revalidate`, ISR) aún no decidida |

> Nota: la configuración **avanzada** de caché/políticas de revalidación es una iniciativa de proactividad adicional (ver sección 5), distinta de la estrategia básica de arriba, que sí forma parte del alcance mínimo.

### Testing

| Ítem | Estado | Nota |
|---|---|---|
| Estrategia definitiva de testing (alcance y herramienta) | ⚪ | Ver punto ambiguo #4 |
| Testing unitario | ⚪ | — |
| Testing de integración / e2e | ⚪ | — |

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
| Empty States | 💡 | — |
| Configuración avanzada de caché / políticas de revalidación | 💡 | Distinta de la estrategia básica de caché (sección 3), que sí es parte del alcance mínimo |

---

## Puntos ambiguos identificados (pendientes de revisión)

No se interpretan unilateralmente — quedan explícitos para decidir en equipo:

1. **Visibilidad del repositorio.** No se verificó si el repositorio remoto en GitHub es público o privado; el reto exige que sea público como entregable.
2. **Verificación de SOLID/Clean Code y escalabilidad/colaboración.** El PDF los menciona como criterios de evaluación, pero no da un mecanismo de verificación individual — ¿se evalúan ítem por ítem o transversalmente en el code review final?
3. **Alcance de Open Graph en la PDP.** No está claro si basta con título/descripción/URL dinámicos, o si se espera también una imagen OG específica por producto.
4. **Alcance de "testing unitario o integración".** El PDF usa un conector disyuntivo ("o"); no aclara si basta con un solo tipo de testing o si se espera cobertura mínima de ambos.
