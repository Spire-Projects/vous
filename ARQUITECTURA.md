# ARQUITECTURA.md — Reglas de Arquitectura · VOUS E-commerce

## Principios Generales

1. **Arquitectura Serverless** — Sin servidores propios. Todo corre en Vercel + Firebase + Cloudinary.
2. **Separación de responsabilidades** — Cada archivo tiene una única responsabilidad clara.
3. **Máximo 150 líneas de código por archivo** — Sin excepciones. Si supera el límite, dividir en módulos más pequeños.
4. **TypeScript estricto** — `strict: true` en `tsconfig.json`. No usar `any`.
5. **Sin lógica de negocio en componentes** — Los componentes solo renderizan. La lógica va en hooks o services.

---

## Regla de las 150 Líneas

> **Todo archivo `.ts` o `.tsx` debe tener como máximo 150 líneas de código.**

### Cómo aplicarla

| Situación                    | Solución                                                             |
| ---------------------------- | -------------------------------------------------------------------- |
| Componente largo             | Extraer subcomponentes en archivos separados                         |
| Hook con mucha lógica        | Separar en hooks más pequeños y componerlos                          |
| Service con muchas funciones | Dividir por dominio (ej: `product.service.ts`, `product.queries.ts`) |
| Archivo de tipos creciente   | Separar por módulo (`product.types.ts`, `order.types.ts`)            |
| Utilidades extensas          | Un archivo por utilidad o familia de utilidades                      |

---

## Estructura de Carpetas

```
src/
├── app/                    # Rutas y páginas (Next.js App Router)
│   ├── (auth)/             # Grupo de rutas de autenticación
│   ├── (shop)/             # Grupo de rutas públicas del e-commerce
│   ├── (admin)/            # Grupo de rutas protegidas de administración
│   ├── api/                # Route Handlers (endpoints de servidor)
│   └── layout.tsx          # Layout raíz
│
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes de diseño genérico (Button, Modal, Input)
│   ├── product/            # Componentes específicos de productos
│   ├── cart/               # Componentes del carrito
│   ├── checkout/           # Componentes del flujo de pago
│   ├── admin/              # Componentes del panel de administración
│   └── layout/             # Header, Footer, Sidebar, Navbar
│
├── hooks/                  # Custom React Hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useProducts.ts
│
├── services/               # Acceso a Firestore y APIs externas
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── user.service.ts
│   └── blog.service.ts
│
├── lib/                    # Configuraciones de SDKs y clientes
│   ├── firebase.ts         # Firebase client SDK
│   ├── firebase-admin.ts   # Firebase Admin SDK (solo servidor)
│   └── cloudinary.ts       # Configuración de Cloudinary
│
├── context/                # Providers de React Context
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── types/                  # Interfaces y tipos TypeScript
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── user.types.ts
│   └── common.types.ts
│
└── utils/                  # Funciones helper puras
    ├── formatCurrency.ts
    ├── formatDate.ts
    └── slugify.ts
```

---

## Convenciones de Nomenclatura

| Elemento              | Convención                | Ejemplo                      |
| --------------------- | ------------------------- | ---------------------------- |
| Componentes React     | PascalCase                | `ProductCard.tsx`            |
| Hooks                 | camelCase con `use`       | `useCart.ts`                 |
| Services              | camelCase + `.service`    | `product.service.ts`         |
| Types / Interfaces    | PascalCase + `.types`     | `product.types.ts`           |
| Utilidades            | camelCase                 | `formatCurrency.ts`          |
| Rutas (carpetas)      | kebab-case                | `app/(shop)/product-detail/` |
| Variables / funciones | camelCase                 | `const productList`          |
| Constantes globales   | UPPER_SNAKE_CASE          | `MAX_CART_ITEMS`             |
| Interfaces TypeScript | prefijo `I` o sin prefijo | `IProduct` o `Product`       |
| Enums                 | PascalCase                | `OrderStatus.PENDING`        |

---

## Patrón de Componentes

### Estructura de un componente

```tsx
// ✅ Correcto — máximo 150 líneas, una responsabilidad
import type { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return <article>{/* render only */}</article>;
}
```

### Reglas de componentes

- No usar `default export` en componentes — usar `named export`
- No hacer fetch de datos dentro del componente — usar hooks o RSC (React Server Components)
- Las props deben tener su interface definida en el mismo archivo o en `types/`
- No usar `useState` para lógica de negocio compleja — extraer a un hook

---

## Patrón de Services (Firestore)

```ts
// services/product.service.ts
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { Product } from "@/types/product.types";

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
}
```

### Reglas de services

- Solo acceden a Firestore, no contienen lógica de UI
- Funciones puras y exportadas individualmente (no clases)
- Siempre tipadas con los tipos de `types/`
- Las operaciones de escritura privilegiadas van en `app/api/` con Admin SDK

---

## Route Handlers (API)

```ts
// app/api/admin/assign-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { verifyAdminToken } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // lógica protegida aquí
}
```

### Reglas de Route Handlers

- Siempre validar el token de autenticación antes de cualquier operación
- Nunca exponer el Admin SDK en el cliente
- Cada endpoint en su propio archivo `route.ts`
- Máximo 150 líneas — extraer lógica a helpers si es necesario

---

## TypeScript — Reglas Estrictas

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
  },
}
```

- **Prohibido**: `any`, `@ts-ignore`, `as unknown as X` sin justificación documentada
- **Obligatorio**: Tipos explícitos en parámetros de funciones y retornos de services
- **Preferido**: `interface` para objetos de datos, `type` para uniones y aliases

---

## ESLint + Prettier

```jsonc
// .eslintrc.json — reglas clave
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
}
```

```jsonc
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
}
```

---

## Buenas Prácticas

### Rendimiento

- Usar `React.memo` en componentes pesados que reciben las mismas props
- Preferir RSC (React Server Components) para data fetching — menos JS en cliente
- Imágenes siempre con `next/image` y Cloudinary — nunca `<img>` plano
- ISR (`revalidate`) para páginas de productos y blog, no SSR en cada request

### Seguridad

- Nunca exponer credenciales en el cliente (solo variables `NEXT_PUBLIC_` son seguras)
- Validar roles con Custom Claims de Firebase en cada Route Handler
- Usar `zod` para validar todos los inputs del usuario antes de escribir en Firestore
- Firestore Security Rules como segunda capa de defensa

### Organización

- Un componente por archivo — nunca dos componentes en el mismo `.tsx`
- Barrel exports (`index.ts`) para agrupar exports por módulo en `components/`, `hooks/`, `context/`, `services/`, `types/` y `utils/`
- Imports absolutos con alias `@/` — nunca rutas relativas profundas (`../../..`)
- Comentarios solo para lógica no obvia — el código debe ser autoexplicativo

---

## CI/CD — Flujo de Trabajo

```
feature/xxx  →  PR a develop  →  GitHub Actions (lint + typecheck + build)
                                        ↓
                              Vercel Preview Deploy
                                        ↓
develop  →  PR a main  →  GitHub Actions  →  Vercel Production Deploy
```

- **Prohibido**: hacer push directo a `main` o `develop`
- **Obligatorio**: PR con revisión antes de merge
- **Obligatorio**: Todos los checks de CI deben pasar antes del merge
