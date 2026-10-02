# Delosi Ecommerce — Reto Técnico 2026

## Descripción

Implementación del reto técnico propuesto por Delosi para 2026: una mini aplicación de e-commerce construida sobre Next.js (App Router), que incluye un listado de productos (PLP) con filtrado/búsqueda/orden persistidos en la URL, una página de detalle de producto (PDP) con metadata dinámica (título, descripción) y Open Graph, y un carrito de compras con estado global reflejado en el Header. Los datos provienen de [Fake Store API](https://fakestoreapi.com/).

## Objetivo

Demostrar una arquitectura modular, escalable y mantenible en Next.js, aplicando buenas prácticas de performance, SEO y UX —los tres pilares de evaluación explícitos del reto—, además de resiliencia ante fallos, TypeScript estricto y principios SOLID/Clean Code, con una sustentación posterior mediante code review.

## Stack actual confirmado por el bootstrap

Lo siguiente está confirmado en el repositorio tal como fue generado por `create-next-app` y verificado al momento de este bootstrap documental:

- **Next.js** 16.3.8 (App Router, carpeta `app/`)
- **React** 19.2.8
- **TypeScript** 5.x, con `strict: true` en `tsconfig.json`
- **Tailwind CSS** v4 (vía `@tailwindcss/postcss`, importado en `app/globals.css`)
- **ESLint** 9.x con `eslint-config-next` (`core-web-vitals` + `typescript`)
- Repositorio Git inicializado, con commit inicial (`Initial commit from Create Next App`)
- Remoto de GitHub configurado (`origin`) y commit inicial ya sincronizado con `origin/main`

> Cualquier otra librería, patrón o herramienta mencionada en este documento fuera de esta lista **no está instalada ni implementada todavía**. Ver [docs/DECISIONS.md](docs/DECISIONS.md) para decisiones pendientes y [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el espacio de decisión arquitectónica.

## Requisitos para ejecutar localmente

- Node.js (versión compatible con Next.js 16 / React 19)
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
```

La aplicación en desarrollo queda disponible en [http://localhost:3000](http://localhost:3000).

## Estructura inicial del proyecto

```
delosi-ecommerce/
├── app/                # App Router (layout, page, estilos globales)
├── public/              # Assets estáticos
├── docs/                 # Documentación técnica del reto
│   ├── CHECKLIST.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

> Esta estructura refleja únicamente el bootstrap actual. La organización por dominios/módulos para PLP, PDP y carrito aún no existe en código y está descrita como propuesta en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## API pública utilizada

[Fake Store API](https://fakestoreapi.com/):

- `GET /products` — listado de productos (PLP)
- `GET /products/categories` — categorías para filtrado (PLP)
- `GET /products/{id}` — detalle de producto (PDP)

## Estado del proyecto

🔵 **Fase actual: planificación y arquitectura.**

El proyecto se encuentra en la etapa de bootstrap documental. Aún no se ha implementado funcionalidad del reto (PLP, PDP, carrito, testing, etc.). Los documentos en `docs/` existen para definir el alcance, dejar explícitas las decisiones ya tomadas y las que siguen pendientes, y servir de checklist de avance.

## Requisitos del reto

Resumen del alcance funcional y técnico exigido por el reto (fuente: *Reto Técnico 2026 - DELOSI.pdf*):

- **PLP**: Server Components para carga inicial, filtrado por categoría, filtros persistidos en Search Params de la URL, búsqueda por texto y/o ordenamiento por criterio de negocio.
- **PDP**: ruta dinámica `/products/[id]`, metadata dinámica (título y descripción), Open Graph, botón "Agregar al carrito".
- **Carrito**: estado global, contador de ítems reflejado en el Header.
- **Criterios técnicos**: performance, SEO y UX, optimización de imágenes externas, lazy loading, prevención de layout shift, arquitectura modular por dominio, TypeScript estricto, SOLID/Clean Code, escalabilidad, justificación de la estrategia de estado del carrito, testing (unitario y/o integración).
- **Iniciativas de proactividad sugeridas**: streaming + Suspense + skeletons, resiliencia ante fallos de API (`error.js`), empty states, caché/revalidación avanzada.
- **Entregables**: repositorio público, README con lineamientos técnicos e instrucciones de ejecución local, sustentación mediante code review de arquitectura, performance y diseño.

Ver detalle completo y seguimiento en [docs/CHECKLIST.md](docs/CHECKLIST.md).

## Decisiones técnicas

El stack base (Next.js App Router, TypeScript, Tailwind CSS, Fake Store API, Git/GitHub) ya está confirmado durante este bootstrap y registrado en [docs/DECISIONS.md](docs/DECISIONS.md). Además, ya existen decisiones iniciales de diseño/arquitectura — como el enfoque Server-first con Server Components para la carga inicial, la integración con Fake Store API y la separación conceptual entre UI, dominio/servicios y acceso a datos —, documentadas con su contexto en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Esto no implica que todas las decisiones de implementación del reto estén cerradas: el estado del carrito, la estrategia de caché/revalidación, el testing y la estructura final de carpetas por dominio siguen pendientes y se documentan como tales en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y [docs/DECISIONS.md](docs/DECISIONS.md).

## Testing

Pendiente de definición. El reto sugiere Jest, React Testing Library, Cypress o Playwright como herramientas posibles. La estrategia definitiva (unitario vs. integración, alcance, herramienta) se registrará en [docs/DECISIONS.md](docs/DECISIONS.md) cuando se tome.

## Performance

Pendiente de implementación. Se documentarán aquí las estrategias aplicadas (optimización de imágenes, lazy loading, prevención de layout shift, caché/revalidación) una vez implementadas y validadas.

## Iniciativas de proactividad

Pendiente de implementación. Se documentará aquí qué iniciativas del reto (streaming + Suspense + skeletons, manejo de errores con `error.js`, empty states, caché avanzada, u otras) fueron efectivamente incorporadas, y cuáles quedaron fuera de alcance.
