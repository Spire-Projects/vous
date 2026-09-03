# CI/CD Setup — VOUS E-commerce

Este documento describe la configuración de Integración Continua (CI) y Despliegue Continuo (CD) para los proyectos `landing` (Next.js) y `admin` (Vite + React).

---

## Integración Continua (CI) — GitHub Actions

### Workflows

| Workflow | Archivo | Proyecto | Trigger |
|----------|---------|----------|---------|
| CI Landing | `.github/workflows/ci-landing.yml` | Next.js — `landing/` | Push/PR a `main` o `develop` |
| CI Admin | `.github/workflows/ci-admin.yml` | Vite — `admin/` | Push/PR a `main` o `develop` |

### Checks ejecutados en cada PR

1. **Lint (ESLint)** — valida reglas de código y formato
2. **Prettier —check** (solo landing) — verifica formato consistente
3. **Type Check & Build** — compila el proyecto con TypeScript estricto

### Variables dummy en CI

Los workflows inyectan variables de entorno dummy durante el build para que no fallen por falta de configuración. Los valores reales nunca están en el repositorio.

---

## Despliegue Continuo (CD) — Vercel

### Landing (Next.js)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Setear **Root Directory** → `landing`
3. Vercel genera automáticamente:
   - **Preview deployments** por cada Pull Request
   - **Production deployments** en cada push a `main`

### Admin (Vite)

1. Conectar el mismo repositorio como proyecto separado en Vercel
2. Setear **Root Directory** → `admin`
3. Setear **Build Command** → `npm run build`
4. Setear **Output Directory** → `dist`
5. Vercel genera previews y producción igual que el landing.

### Variables de entorno en Vercel

Configurar en el dashboard de Vercel (Settings → Environment Variables) por entorno:

**Landing — Production / Preview:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Admin — Production / Preview:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

---

## Branch Protection (Recomendado)

En GitHub → Settings → Branches, configurar reglas para `main` y `develop`:

- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - Seleccionar los checks:
    - `Lint, Format, Type Check & Build` (CI Landing)
    - `Lint, Type Check & Build` (CI Admin)
- ✅ **Require branches to be up to date before merging**
- ✅ **Restrict pushes that create files larger than 100MB**
- ❌ **Do not allow bypassing the above settings** (para admin/superadmin también)

---

## Seguridad

- `.env.local` está en `.gitignore` en ambos proyectos
- `.env.example` SÍ se comitea como plantilla documentada
- Ninguna clave sensible está hardcodeada en el código fuente
- El CI usa valores dummy explícitos; los reales se configuran solo en Vercel
