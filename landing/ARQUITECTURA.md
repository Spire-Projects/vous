# ARQUITECTURA.md — Reglas de Arquitectura · VOUS E-commerce

## Principios Generales

1. **Arquitectura Serverless** — Sin servidores propios. Todo corre en Vercel + Firebase + Cloudinary.
2. **Separación de responsabilidades** — Cada archivo tiene una única responsabilidad clara.
3. **Máximo 150 líneas de código por archivo** — Sin excepciones. Si supera el límite, dividir en módulos más pequeños.
4. **TypeScript estricto** — `strict: true` en `tsconfig.json`. No usar `any`.
5. **Sin lógica de negocio en componentes** — Los componentes solo renderizan. La lógica va en hooks o services.

---

## Clean Architecture — Capas

> La estructura de este proyecto sigue los principios de **Clean Architecture**: las capas internas no conocen las externas. El dominio no depende de React, Firebase ni ningún framework.

```
┌──────────────────────────────────────────┐
│           Presentación (React)           │  ← components/, app/, hooks/
├──────────────────────────────────────────┤
│           Aplicación (Use Cases)         │  ← application/use-cases/
├──────────────────────────────────────────┤
│            Dominio (Entidades)           │  ← domain/entities/, domain/repositories/
├──────────────────────────────────────────┤
│       Infraestructura (Firestore, etc.)  │  ← infrastructure/
└──────────────────────────────────────────┘
         ↑ las flechas de dependencia apuntan hacia adentro únicamente
```

### Capa de Dominio (`domain/`)

- Contiene las **entidades** del negocio y las **interfaces de repositorio** (contratos).
- **Cero dependencias** de React, Firebase, Next.js o cualquier framework.
- Es el núcleo inmutable del sistema: si cambia Firebase, el dominio no se toca.

```ts
// domain/entities/product.entity.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
}

// domain/repositories/product.repository.ts
import type { Product } from "@/domain/entities/product.entity";

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
```

### Capa de Aplicación (`application/`)

- Contiene los **casos de uso**: orquesta entidades y repositorios sin saber cómo se implementan.
- No importa Firebase directamente — solo usa las interfaces del dominio.
- Cada caso de uso es una función exportada, máximo 150 líneas.

```ts
// application/use-cases/get-products-by-category.ts
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export async function getProductsByCategory(
  repo: ProductRepository,
  categoryId: string
): Promise<Product[]> {
  return repo.findByCategory(categoryId);
}
```

### Capa de Infraestructura (`infrastructure/`)

- Implementa las interfaces del dominio usando Firebase, Cloudinary, etc.
- Es la única capa que conoce los SDKs externos.
- Si se cambia de Firestore a otra base de datos, solo esta capa cambia.

```ts
// infrastructure/repositories/firestore-product.repository.ts
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export const firestoreProductRepository: ProductRepository = {
  async findByCategory(categoryId) {
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  },
  async findById(id) {
    // ...
  },
  async save(product) {
    await setDoc(doc(db, "products", product.id), product);
  },
};
```

### Capa de Presentación (`components/`, `app/`, `hooks/`)

- Componentes React que **solo renderizan** — sin lógica de negocio.
- Los hooks conectan los casos de uso con el estado de React.
- Las páginas (`app/`) orquestan componentes y llaman hooks.

```ts
// hooks/useProductsByCategory.ts
import { useEffect, useState } from "react";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { getProductsByCategory } from "@/application/use-cases/get-products-by-category";
import type { Product } from "@/domain/entities/product.entity";

export function useProductsByCategory(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory(firestoreProductRepository, categoryId)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { products, loading };
}
```

---

## Regla de las 150 Líneas

> **Todo archivo `.ts` o `.tsx` debe tener como máximo 150 líneas de código.**

### Cómo aplicarla

| Situación                  | Solución                                                                       |
| -------------------------- | ------------------------------------------------------------------------------ |
| Componente largo           | Extraer subcomponentes en archivos separados                                   |
| Hook con mucha lógica      | Separar en hooks más pequeños y componerlos                                    |
| Caso de uso extenso        | Dividir en casos de uso más pequeños y componerlos                             |
| Repositorio con muchas ops | Dividir por dominio (`product.repository.ts`, `product.queries.repository.ts`) |
| Archivo de tipos creciente | Separar por módulo (`product.types.ts`, `order.types.ts`)                      |
| Utilidades extensas        | Un archivo por utilidad o familia de utilidades                                |

---

## Estructura de Carpetas

```
src/
├── app/                        # Next.js App Router (solo routing y composición)
│   ├── (auth)/                 # Grupo: autenticación
│   ├── (main)/                 # Grupo: rutas públicas del e-commerce
│   ├── (checkout)/             # Grupo: flujo de pago
│   ├── api/                    # Route Handlers — Admin SDK, lógica protegida
│   └── layout.tsx              # Layout raíz
│
├── domain/                     # ★ Capa de Dominio (sin dependencias de framework)
│   ├── entities/               # Entidades del negocio
│   │   ├── product.entity.ts
│   │   ├── order.entity.ts
│   │   └── user.entity.ts
│   ├── repositories/           # Interfaces (contratos) de acceso a datos
│   │   ├── product.repository.ts
│   │   └── order.repository.ts
│   └── value-objects/          # Objetos de valor (Price, Email, Slug…)
│
├── application/                # ★ Capa de Aplicación (casos de uso)
│   ├── use-cases/
│   │   ├── product/
│   │   │   ├── get-products-by-category.ts
│   │   │   └── get-product-by-id.ts
│   │   ├── order/
│   │   │   └── create-order.ts
│   │   └── auth/
│   │       └── login-with-google.ts
│   └── dtos/                   # Data Transfer Objects de entrada/salida
│
├── infrastructure/             # ★ Capa de Infraestructura (implementaciones)
│   ├── repositories/           # Implementaciones Firestore de los repositorios
│   │   ├── firestore-product.repository.ts
│   │   └── firestore-order.repository.ts
│   └── storage/                # Cloudinary, Firebase Storage
│
├── components/                 # ★ Capa de Presentación: componentes React
│   ├── ui/                     # shadcn/ui — solo personalizaciones de estilo VOUS
│   ├── product/                # Componentes de producto
│   ├── cart/                   # Componentes del carrito
│   ├── checkout/               # Componentes del flujo de pago
│   └── layout/                 # Header, Footer, Sidebar, Navbar
│
├── hooks/                      # Adaptadores Presentación ↔ Aplicación
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useProducts.ts
│
├── lib/                        # Inicialización de SDKs externos
│   ├── firebase.ts             # Firebase client SDK
│   ├── firebaseAdmin.ts        # Firebase Admin SDK (solo servidor)
│   └── cloudinary.ts           # Cloudinary config
│
├── context/                    # React Context Providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── types/                      # Tipos TypeScript globales / compartidos
│   ├── auth.types.ts
│   └── cart.types.ts
│
└── utils/                      # Funciones helper puras (sin efectos secundarios)
    ├── formatCurrency.ts
    ├── formatDate.ts
    └── slugify.ts
```

---

## UI Library — shadcn/ui

> **No reinventes la rueda.** Ya existen librerías de componentes de calidad. El objetivo es adaptar su estilo al look & feel de VOUS, no recrear sus primitivas desde cero.

### Reglas de UI

- **Obligatorio**: Usar [shadcn/ui](https://ui.shadcn.com/) como base para todos los componentes de interfaz (Button, Input, Dialog, Select, Table, Badge, Card…).
- **Prohibido**: Crear un componente desde cero si shadcn/ui ya lo provee.
- **Permitido**: Extender o wrappear un componente de shadcn con variantes propias de VOUS usando `cva` (class-variance-authority) o Tailwind.
- Los archivos en `components/ui/` son **únicamente** las personalizaciones de shadcn — no lógica de negocio.

### Cómo personalizar sin recrear

```tsx
// ✅ Correcto — extender Button de shadcn con variante propia
import { Button } from "@/components/ui/button"; // shadcn instalado

// Solo sobreescribir la variante con clases Tailwind de la marca VOUS
export function VousButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="default"
      className="rounded-full bg-stone-900 text-white hover:bg-stone-700 font-medium"
      {...props}
    />
  );
}
```

```tsx
// ❌ Incorrecto — recrear un botón desde zero
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="...">{children}</button>; // no hacer esto
}
```

### Flujo de incorporación de un componente nuevo

1. Buscar en `shadcn/ui` si el componente existe → `npx shadcn@latest add <component>`
2. Si shadcn no lo tiene → buscar en [Radix UI](https://www.radix-ui.com/) o [Headless UI](https://headlessui.com/)
3. Si ninguna librería lo provee → crear el componente siguiendo el patrón de componentes de este documento
4. **Nunca duplicar** un componente que ya existe en `components/ui/`

---

## Convenciones de Nomenclatura

| Elemento              | Convención                 | Ejemplo                           |
| --------------------- | -------------------------- | --------------------------------- |
| Componentes React     | PascalCase                 | `ProductCard.tsx`                 |
| Hooks                 | camelCase con `use`        | `useCart.ts`                      |
| Casos de uso          | kebab-case                 | `get-products-by-category.ts`     |
| Repositorios          | kebab-case + `.repository` | `firestore-product.repository.ts` |
| Entidades             | PascalCase + `.entity`     | `product.entity.ts`               |
| Types / Interfaces    | PascalCase + `.types`      | `product.types.ts`                |
| Utilidades            | camelCase                  | `formatCurrency.ts`               |
| Rutas (carpetas)      | kebab-case                 | `app/(main)/product-detail/`      |
| Variables / funciones | camelCase                  | `const productList`               |
| Constantes globales   | UPPER_SNAKE_CASE           | `MAX_CART_ITEMS`                  |
| Interfaces TypeScript | sin prefijo                | `Product`, `Order`                |
| Enums                 | PascalCase                 | `OrderStatus.PENDING`             |

---

## Patrón de Componentes

### Estructura de un componente

```tsx
// ✅ Correcto — máximo 150 líneas, una responsabilidad, usa shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/domain/entities/product.entity";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card>
      <CardContent>
        <Badge>{product.categoryId}</Badge>
        <p>{product.name}</p>
        <Button onClick={() => onAddToCart(product.id)}>Agregar</Button>
      </CardContent>
    </Card>
  );
}
```

### Reglas de componentes

- No usar `default export` en componentes — usar `named export`
- No hacer fetch de datos dentro del componente — usar hooks o RSC (React Server Components)
- Las props deben tener su interface definida en el mismo archivo
- No usar `useState` para lógica de negocio compleja — extraer a un hook
- Siempre usar componentes de `shadcn/ui` antes de construir uno nuevo
- Ajustar el estilo con clases Tailwind según el diseño de VOUS — nunca modificar el código fuente de shadcn directamente

---

## Patrón de Repositorios (Infraestructura)

```ts
// infrastructure/repositories/firestore-product.repository.ts
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export const firestoreProductRepository: ProductRepository = {
  async findByCategory(categoryId: string): Promise<Product[]> {
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
  },
};
```

### Reglas de infraestructura

- Los repositorios implementan **interfaces del dominio** — el dominio nunca importa infraestructura
- Solo acceden a Firestore o servicios externos, sin lógica de UI ni de negocio
- Funciones/objetos exportados individualmente (no clases)
- Las operaciones de escritura privilegiadas van en `app/api/` con Admin SDK

---

## Route Handlers (API)

```ts
// app/api/admin/assign-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
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
- Validar el body con `zod` antes de cualquier escritura

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
- **Obligatorio**: Tipos explícitos en parámetros de funciones y retornos de use cases y repositorios
- **Preferido**: `interface` para entidades y objetos de datos, `type` para uniones y aliases

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
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
}
```

---

## Buenas Prácticas

### No reinventes la rueda

- **shadcn/ui primero** — antes de crear cualquier componente, verificar si existe en shadcn, Radix UI o Headless UI.
- **Librerías sobre código propio** — para formularios usar `react-hook-form`, para validación `zod`, para fechas `date-fns`, para animaciones `framer-motion`. No reimplementar estas funcionalidades.
- **Solo personaliza estilos** — el comportamiento y la accesibilidad ya están resueltos por las librerías; la tarea es adaptar colores, tipografías y espaciados al diseño de VOUS con Tailwind.

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
- Barrel exports (`index.ts`) para agrupar exports por módulo en `components/`, `hooks/`, `context/`, `domain/`, `application/`, `infrastructure/`, `types/` y `utils/`
- Imports absolutos con alias `@/` — nunca rutas relativas profundas (`../../..`)
- Comentarios solo para lógica no obvia — el código debe ser autoexplicativo

---

## Regla de Dependencias entre Capas

| Capa              | Puede importar de                                | NO puede importar de                               |
| ----------------- | ------------------------------------------------ | -------------------------------------------------- |
| `domain/`         | Nada externo                                     | `infrastructure/`, `application/`, React, Firebase |
| `application/`    | `domain/`                                        | `infrastructure/`, React, Firebase                 |
| `infrastructure/` | `domain/`, `lib/`                                | `application/`, `components/`                      |
| `components/`     | `hooks/`, `types/`, `utils/`, `domain/entities/` | `infrastructure/` directamente                     |
| `hooks/`          | `application/`, `infrastructure/`, `context/`    | —                                                  |
| `app/`            | `components/`, `hooks/`, `context/`              | `infrastructure/` directamente                     |

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
