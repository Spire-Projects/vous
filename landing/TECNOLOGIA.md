# TECNOLOGIA.md — Stack Tecnológico · VOUS E-commerce

## Stack Principal

| Tecnología         | Versión          | Rol                                          |
| ------------------ | ---------------- | -------------------------------------------- |
| Next.js            | 16.x (App Router) | Framework principal, SSR / ISR / SSG         |
| React              | 19.x              | UI library                                   |
| TypeScript         | 5+ (strict)       | Tipado estático en todo el proyecto          |
| TailwindCSS        | 4+                | Sistema de estilos utilitario                |
| Firebase Auth      | 10+              | Autenticación y gestión de sesiones          |
| Firestore          | 10+              | Base de datos NoSQL serverless (colecciones) |
| Firebase Admin SDK | 12+              | Operaciones privilegiadas en servidor        |
| Cloudinary         | Latest           | Almacenamiento y optimización de imágenes    |
| Vercel             | —                | Plataforma de despliegue y edge functions    |

---

## Librerías por Módulo

### UI / Componentes

| Librería            | Uso                                                    |
| ------------------- | ------------------------------------------------------ |
| `clsx`              | Composición condicional de clases CSS                  |
| `tailwind-merge`    | Merge seguro de clases Tailwind sin conflictos         |
| `framer-motion`     | Animaciones y transiciones de UI                       |
| `lucide-react`      | Iconos SVG consistentes y optimizados                  |
| `@headlessui/react` | Componentes accesibles sin estilos (Modals, Dropdowns) |

### Formularios y Validación

| Librería          | Uso                                                       |
| ----------------- | --------------------------------------------------------- |
| `react-hook-form` | Manejo de formularios con control de estado mínimo        |
| `zod`             | Validación de esquemas con inferencia de tipos TypeScript |

### Editor de Contenido (Blog / CMS)

| Librería              | Uso                                                   |
| --------------------- | ----------------------------------------------------- |
| `@tiptap/react`       | Editor de texto enriquecido para blog y descripciones |
| `@tiptap/starter-kit` | Extensiones base de Tiptap                            |

### Analíticas y Gráficas

| Librería   | Uso                                                       |
| ---------- | --------------------------------------------------------- |
| `recharts` | Gráficas de ventas, inventario y métricas en el dashboard |

### Imágenes

| Librería           | Uso                                                      |
| ------------------ | -------------------------------------------------------- |
| `next/image`       | Optimización automática de imágenes (lazy loading, WebP) |
| `@cloudinary/next` | Integración oficial de Cloudinary con Next.js            |

### Utilidades

| Librería   | Uso                                               |
| ---------- | ------------------------------------------------- |
| `date-fns` | Formateo y manipulación de fechas                 |
| `nanoid`   | Generación de IDs únicos en cliente               |
| `slugify`  | Generación de slugs para URLs de productos y blog |

---

## Firebase — Configuración

### Auth

- Proveedores: Email/Password, Google OAuth
- Custom Claims para roles: `customer`, `wholesaler`, `admin`, `superadmin`
- Sesión persistida con `onAuthStateChanged`

### Firestore — Colecciones Principales

```
/products/{id}
/categories/{id}
/orders/{id}
/users/{uid}
/blog-posts/{id}
/discounts/{id}
/site-config/global
/wholesale-accounts/{uid}
```

### Admin SDK

- Usado exclusivamente en Route Handlers (`/app/api/`)
- Verificación de tokens y asignación de Custom Claims

---

## Cloudinary — Configuración

- Upload con transformaciones automáticas (resize, WebP, quality auto)
- Carpetas organizadas: `vous/products/`, `vous/banners/`, `vous/blog/`
- Lazy loading con `next/image` + `fill` o `width/height` explícito
- URL firmadas para contenido protegido (mayoreo)

---

## CI/CD Pipeline

```
GitHub Push / PR
       ↓
GitHub Actions
  - ESLint
  - Prettier --check
  - TypeScript (tsc --noEmit)
  - Build de producción (next build)
       ↓
Vercel Deploy (preview en PR / prod en main)
```

---

## Variables de Entorno

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (solo servidor)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

> **Regla de seguridad**: Las variables sin prefijo `NEXT_PUBLIC_` son exclusivamente de servidor. Nunca exponerlas al cliente.

---

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm run start

# Linting
npm run lint

# Formato
npm run format

# Verificar formato sin escritura
npm run format:check
```

---

## Scripts en `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```
