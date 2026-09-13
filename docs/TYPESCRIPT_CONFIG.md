# ⚙️ Guía de Configuración TypeScript (`tsconfig.json`) y Advertencias en el IDE

Este documento explica en detalle el comportamiento de los archivos `tsconfig.json` dentro del monorepo **LogiPulse AI**, por qué el servidor de lenguaje de TypeScript (TSServer) en editores como VS Code / Antigravity IDE puede mostrar advertencias o subrayados rojos en estos archivos, y por qué el sistema compila y ejecuta al 100% sin afectaciones.

---

## 🔍 1. Explicación Técnica de las Advertencias en el IDE

### A. Advertencia por `baseUrl` (en Microservicios NestJS)
* **Archivos afectados**: `apps/orders-service/tsconfig.json`, `apps/telemetry-service/tsconfig.json`, `apps/ai-analytics-service/tsconfig.json`.
* **Causa**: TypeScript 5.0+ marcó la opción `"baseUrl": "./"` como **deprecada si se utiliza de forma aislada sin definir un diccionario `"paths"`**.
* **Motivo**: Historicamente NestJS CLI incluía `"baseUrl": "./"` por defecto para permitir imports basados en la raíz del proyecto (e.g. `import { Order } from 'src/domain/entities/order'`). En TypeScript 5+, la recomendación estricta es declarar siempre `"paths"` en conjunto con `baseUrl`.

### B. Advertencia por `target: "es5"` y `paths` (en Frontend Next.js)
* **Archivo afectado**: `apps/web/tsconfig.json`.
* **Causa 1 (`es5`)**: La plantilla generadora por defecto de Next.js (`create-next-app`) coloca `"target": "es5"`. TypeScript 5+ emite un aviso de deprecación al apuntar a ES5 como target directo en el servidor de lenguaje.
* **Causa 2 (`paths` sin `baseUrl`)**: `apps/web/tsconfig.json` incluye `"paths": { "@/*": ["./src/*"] }`. En ciertas versiones de TypeScript Language Server, se exige que la propiedad `"baseUrl": "."` esté explícitamente declarada cuando se usan alias de ruta (`paths`).

---

## 🛡️ 2. ¿Por qué NO afecta la Compilación ni la Ejecución?

| Entorno / Herramienta | Mecanismo de Compilación | Comportamiento con la Advertencia |
|---|---|---|
| **NestJS Services** (`orders`, `telemetry`, `ai`) | `nest build` / `tsc` | El compilador de TypeScript procesa los archivos `.ts` a JavaScript en `dist/` ignorando advertencias informativas de deprecación del IDE. |
| **Next.js 14+ Frontend** (`apps/web`) | Compilador **SWC** (escrito en Rust) | Next.js no utiliza el transpilador nativo de TypeScript. SWC se encarga de la transpilación a navegadores modernos e **ignora la opción `"target": "es5"` de TypeScript**. |

Por este motivo, los comandos `pnpm dev:orders`, `pnpm dev:telemetry`, `pnpm dev:ai`, `pnpm --filter @logipulse/web dev` y `pnpm test:all` funcionan sin ningún tipo de error.

---

## 💡 3. Configuraciones de Referencia Sugeridas

Si en el futuro se desea eliminar completamente las marcas de advertencia del IDE:

### A. Para Microservicios NestJS (`apps/orders-service`, `apps/telemetry-service`, `apps/ai-analytics-service`)
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

### B. Para Aplicaciones Next.js 14+ (`apps/web`)
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
