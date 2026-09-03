# VOUS — Setup del Proyecto

Proyecto Next.js 16 (App Router) con Firebase, Cloudinary y TailwindCSS v4.

---

## Requisitos

- Node.js 20+
- npm 10+
- Cuenta de Firebase (Auth + Firestore habilitados)
- Cuenta de Cloudinary

---

## Setup local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Vous
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y completa todos los valores:

| Variable                                   | Descripción                            |
| ------------------------------------------ | -------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | API Key del proyecto Firebase          |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Dominio de auth de Firebase            |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | ID del proyecto Firebase               |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Bucket de Storage                      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID                              |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | App ID de Firebase                     |
| `FIREBASE_ADMIN_PROJECT_ID`                | Project ID (Admin SDK — solo servidor) |
| `FIREBASE_ADMIN_CLIENT_EMAIL`              | Email de cuenta de servicio            |
| `FIREBASE_ADMIN_PRIVATE_KEY`               | Clave privada (con `\n` escapados)     |
| `CLOUDINARY_CLOUD_NAME`                    | Cloud name de Cloudinary               |
| `CLOUDINARY_API_KEY`                       | API Key de Cloudinary                  |
| `CLOUDINARY_API_SECRET`                    | API Secret (solo servidor)             |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`     | Upload preset unsigned                 |

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

| Comando                | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con hot-reload    |
| `npm run build`        | Build de producción                      |
| `npm run start`        | Iniciar servidor de producción           |
| `npm run lint`         | Revisar errores de ESLint                |
| `npm run format`       | Formatear código con Prettier            |
| `npm run format:check` | Verificar formato sin modificar archivos |

---

## Estructura del proyecto

```
src/
├── app/           # Páginas y layouts (App Router)
├── components/    # Componentes reutilizables de UI
├── context/       # React Context providers (auth, carrito, etc.)
├── hooks/         # Custom hooks de React
├── lib/           # Configuraciones de servicios externos
│   ├── firebase.ts        # Firebase Auth + Firestore (cliente)
│   ├── firebaseAdmin.ts   # Firebase Admin SDK (solo servidor)
│   └── cloudinary.ts      # Cloudinary Node SDK (solo servidor)
├── services/      # Lógica de acceso a datos (Firestore)
├── types/         # Interfaces y tipos TypeScript
└── utils/         # Helpers y funciones utilitarias
```

---

## Firebase

- **Cliente** (`src/lib/firebase.ts`): Auth + Firestore, para uso en componentes de React.
- **Admin SDK** (`src/lib/firebaseAdmin.ts`): solo en Server Components y API Routes; marcado `server-only`.
- Reglas de Firestore en `firestore.rules`. Para desplegar: `firebase deploy --only firestore:rules`

## Cloudinary

- `src/lib/cloudinary.ts` usa el Node SDK (server-only). Para uploads desde el cliente, usa el `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` con fetch directo a la API de Cloudinary.

---

## Paleta de colores VOUS

| Token             | Color     | Uso                   |
| ----------------- | --------- | --------------------- |
| `vous-warm-white` | `#FDFAF5` | Fondo principal       |
| `vous-cream`      | `#F5F0E8` | Fondos secundarios    |
| `vous-soft-black` | `#1A1A18` | Texto principal       |
| `vous-gold`       | `#C9A84C` | Color primario / CTAs |
| `vous-gray`       | `#6B6B63` | Texto secundario      |

Tipografías: **Cormorant Garamond** (serif) + **Inter** (sans-serif), cargadas con `next/font`.

---

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Agrega todas las variables de `.env.example` en _Settings → Environment Variables_
3. Vercel detecta Next.js automáticamente — sin configuración adicional
