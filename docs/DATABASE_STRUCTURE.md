# VOUS — Estructura de Base de Datos (Firestore)

> Tecnología: Firebase Firestore (NoSQL, serverless)  
> Almacenamiento de imágenes: Cloudinary  
> Autenticación: Firebase Auth  
> Fecha: Mayo 2026

---

## Índice

1. [Visión General](#1-visión-general)
2. [Diagrama de Colecciones](#2-diagrama-de-colecciones)
3. [Colección: `users`](#3-colección-users)
4. [Colección: `adminUsers`](#4-colección-adminusers)
5. [Colección: `categories`](#5-colección-categories)
6. [Colección: `products`](#6-colección-products)
7. [Colección: `orders`](#7-colección-orders)
8. [Colección: `wholesaleRequests`](#8-colección-wholesalerequests)
9. [Colección: `blogPosts`](#9-colección-blogposts)
10. [Colección: `banners`](#10-colección-banners)
11. [Colección: `faqs`](#11-colección-faqs)
12. [Colección: `discounts`](#12-colección-discounts)
13. [Documento: `landingConfig`](#13-documento-landingconfig)
14. [Documento: `paymentConfig`](#14-documento-paymentconfig)
15. [Documento: `wholesaleRules`](#15-documento-wholesalerules)
16. [Documento: `siteConfig`](#16-documento-siteconfig)
17. [Reglas de Seguridad Firestore](#17-reglas-de-seguridad-firestore)
18. [Índices Recomendados](#18-índices-recomendados)
19. [Mapa Admin Panel → Colecciones](#19-mapa-admin-panel--colecciones)
20. [Mapa Landing Page → Colecciones](#20-mapa-landing-page--colecciones)

---

## 1. Visión General

La base de datos está diseñada sobre **Firestore** (NoSQL orientado a documentos), siguiendo los principios de:

- **Desnormalización estratégica**: se copian snapshots de datos en pedidos para mantener histórico aunque el producto cambie.
- **Escalabilidad de atributos**: los productos tienen un mapa `attributes` dinámico para soportar nuevos campos sin rediseñar la arquitectura.
- **Variantes flexibles**: las variantes de producto soportan combinaciones de talla/color, solo talla, solo color o sin variantes.
- **Documentos singleton**: configuraciones globales (landing, pagos, reglas mayoristas, site) se almacenan como documentos únicos en su propia colección.
- **Seguridad por roles**: Firestore Security Rules protegen los datos sensibles según el rol del usuario (customer, wholesale, admin, superadmin).

---

## 2. Diagrama de Colecciones

```
Firestore Root
│
├── users/                      → Clientes registrados
├── adminUsers/                 → Administradores y superadmin
├── categories/                 → Categorías de productos
├── products/                   → Catálogo de productos
│   └── {productId}/
│       └── variants/           → Subcol. variantes por producto
├── orders/                     → Pedidos de clientes
│   └── {orderId}/
│       └── statusHistory/      → Subcol. historial de estados
├── wholesaleRequests/          → Solicitudes de clientes mayoristas
├── blogPosts/                  → Publicaciones del blog/revista
├── banners/                    → Banners de la landing page
├── faqs/                       → Preguntas frecuentes
├── discounts/                  → Códigos y reglas de descuento
├── landingConfig/
│   └── main                    → Config. de secciones de la landing
├── paymentConfig/
│   └── main                    → Config. de métodos de pago
├── wholesaleRules/
│   └── main                    → Reglas comerciales para mayoristas
└── siteConfig/
    └── main                    → Config. general del sitio
```

---

## 3. Colección: `users`

Almacena los perfiles de los clientes autenticados mediante Firebase Auth. El `userId` coincide con el `uid` de Firebase Auth.

**Ruta:** `users/{userId}`

| Campo              | Tipo        | Requerido | Descripción                                              |
|--------------------|-------------|-----------|----------------------------------------------------------|
| `uid`              | `string`    | ✓         | UID de Firebase Auth                                     |
| `email`            | `string`    | ✓         | Correo electrónico                                       |
| `name`             | `string`    | ✓         | Nombre completo                                          |
| `phone`            | `string`    | ✓         | Número de celular                                        |
| `department`       | `string`    | ✓         | Departamento de residencia                               |
| `role`             | `string`    | ✓         | `"customer"` \| `"wholesale"`                            |
| `wholesaleStatus`  | `string`    | ✓         | `"none"` \| `"pending"` \| `"approved"` \| `"rejected"` |
| `isActive`         | `boolean`   | ✓         | Permite desactivar cuentas sin eliminarlas               |
| `createdAt`        | `timestamp` | ✓         | Fecha de creación                                        |
| `updatedAt`        | `timestamp` | ✓         | Última actualización                                     |

**Ejemplo de documento:**
```json
{
  "uid": "firebase_auth_uid_abc123",
  "email": "cliente@ejemplo.com",
  "name": "María García",
  "phone": "71234567",
  "department": "Santa Cruz",
  "role": "customer",
  "wholesaleStatus": "none",
  "isActive": true,
  "createdAt": "2026-05-14T10:00:00Z",
  "updatedAt": "2026-05-14T10:00:00Z"
}
```

---

## 4. Colección: `adminUsers`

Almacena los perfiles de los administradores del panel. Separada de `users` por seguridad y claridad de roles.

**Ruta:** `adminUsers/{userId}`

| Campo         | Tipo        | Requerido | Descripción                                              |
|---------------|-------------|-----------|----------------------------------------------------------|
| `uid`         | `string`    | ✓         | UID de Firebase Auth                                     |
| `email`       | `string`    | ✓         | Correo electrónico                                       |
| `name`        | `string`    | ✓         | Nombre completo                                          |
| `role`        | `string`    | ✓         | `"superadmin"` \| `"admin"`                              |
| `isActive`    | `boolean`   | ✓         | Permite activar/desactivar acceso sin eliminar           |
| `permissions` | `string[]`  | ✗         | Permisos granulares (para expansión futura)              |
| `createdBy`   | `string`    | ✓         | UID del superadmin que lo creó                           |
| `createdAt`   | `timestamp` | ✓         | Fecha de creación                                        |
| `updatedAt`   | `timestamp` | ✓         | Última actualización                                     |

**Roles:**
- `superadmin`: Control total. Único capaz de gestionar otros admins.
- `admin`: Acceso operativo al panel según permisos asignados.

---

## 5. Colección: `categories`

Categorías del catálogo, completamente administrables desde el panel.

**Ruta:** `categories/{categoryId}`

| Campo         | Tipo        | Requerido | Descripción                                        |
|---------------|-------------|-----------|----------------------------------------------------|
| `id`          | `string`    | ✓         | ID auto-generado                                   |
| `name`        | `string`    | ✓         | Nombre de la categoría                             |
| `slug`        | `string`    | ✓         | URL amigable (ej: `"ropa-deportiva"`)              |
| `description` | `string`    | ✗         | Descripción opcional                               |
| `image`       | `string`    | ✗         | URL de imagen en Cloudinary                        |
| `banner`      | `string`    | ✗         | URL del banner en Cloudinary                       |
| `isActive`    | `boolean`   | ✓         | Activar / desactivar visibilidad                   |
| `sortOrder`   | `number`    | ✓         | Orden visual en el catálogo y landing              |
| `createdAt`   | `timestamp` | ✓         | Fecha de creación                                  |
| `updatedAt`   | `timestamp` | ✓         | Última actualización                               |

---

## 6. Colección: `products`

Catálogo principal de productos. Incluye una **subcolección `variants`** para manejar combinaciones de talla y color con stock individual.

**Ruta:** `products/{productId}`

### Documento principal

| Campo                   | Tipo       | Requerido | Descripción                                              |
|-------------------------|------------|-----------|----------------------------------------------------------|
| `id`                    | `string`   | ✓         | ID auto-generado                                         |
| `name`                  | `string`   | ✓         | Nombre del producto                                      |
| `detail`                | `string`   | ✓         | Descripción/detalle del producto                         |
| `categoryId`            | `string`   | ✗         | Referencia a `categories/{categoryId}`                   |
| `categoryName`          | `string`   | ✗         | Snapshot del nombre de categoría (para queries rápidas)  |
| `images`                | `string[]` | ✗         | URLs de Cloudinary (primer elemento = imagen principal)  |
| `price`                 | `number`   | ✓         | Precio minorista en BOB                                  |
| `wholesalePrice`        | `number`   | ✗         | Precio mayorista en BOB (solo visible a mayoristas aprobados) |
| `attributes`            | `map`      | ✗         | Atributos dinámicos del producto (ver detalle abajo)     |
| `hasVariants`           | `boolean`  | ✓         | Si el producto maneja variantes                          |
| `variantType`           | `string`   | ✗         | `"color_size"` \| `"color"` \| `"size"` \| `"none"`     |
| `isFeatured`            | `boolean`  | ✓         | Producto destacado                                       |
| `isDiscounted`          | `boolean`  | ✓         | Tiene descuento activo                                   |
| `discountPercentage`    | `number`   | ✗         | Porcentaje de descuento (0-100)                          |
| `discountedPrice`       | `number`   | ✗         | Precio calculado con descuento                           |
| `isPresale`             | `boolean`  | ✓         | Producto en preventa                                     |
| `isSpecialCollection`   | `boolean`  | ✓         | Pertenece a una colección especial                       |
| `isBestSeller`          | `boolean`  | ✓         | Producto más vendido                                     |
| `isExclusiveWholesale`  | `boolean`  | ✓         | Exclusivo para mayoristas aprobados                      |
| `isActive`              | `boolean`  | ✓         | Activo / inactivo en el catálogo                         |
| `sortOrder`             | `number`   | ✓         | Orden manual dentro del catálogo                         |
| `tags`                  | `string[]` | ✗         | Tags libres para colecciones y filtros                   |
| `totalSold`             | `number`   | ✓         | Unidades vendidas totales (para reportes)                |
| `createdAt`             | `timestamp`| ✓         | Fecha de creación                                        |
| `updatedAt`             | `timestamp`| ✓         | Última actualización                                     |

### Mapa `attributes` (dinámico)

El campo `attributes` es un mapa flexible que permite añadir nuevos atributos sin modificar la arquitectura. Solo se almacenan los atributos configurados para cada producto.

```json
"attributes": {
  "cut": "Recto",
  "colors": ["Negro", "Blanco", "Beige"],
  "sizes": ["XS", "S", "M", "L", "XL"],
  "fabric": "92% Poliéster, 8% Elastano",
  "waistband": "Elástica ancha",
  "length": "Largo tobillo"
}
```

> Los filtros del catálogo se generan **dinámicamente** a partir de los atributos existentes en los productos activos. Si un atributo existe en al menos un producto, aparece como filtro en el catálogo.

### Subcolección: `products/{productId}/variants`

**Ruta:** `products/{productId}/variants/{variantId}`

| Campo       | Tipo       | Requerido | Descripción                                        |
|-------------|------------|-----------|----------------------------------------------------|
| `id`        | `string`   | ✓         | ID auto-generado                                   |
| `sku`       | `string`   | ✗         | SKU individual (opcional)                          |
| `color`     | `string`   | ✗         | Color de la variante (ej: `"Negro"`)               |
| `size`      | `string`   | ✗         | Talla de la variante (ej: `"M"`)                   |
| `stock`     | `number`   | ✓         | Stock disponible para esta variante                |
| `isActive`  | `boolean`  | ✓         | Activa / inactiva                                  |
| `createdAt` | `timestamp`| ✓         | Fecha de creación                                  |
| `updatedAt` | `timestamp`| ✓         | Última actualización                               |

**Ejemplos de combinaciones de variantes:**

| Escenario          | `variantType`  | Variante ejemplo                    |
|--------------------|----------------|-------------------------------------|
| Color + Talla      | `"color_size"` | `color: "Negro"`, `size: "M"`       |
| Solo talla         | `"size"`       | `color: null`, `size: "L"`          |
| Solo color         | `"color"`      | `color: "Blanco"`, `size: null`     |
| Sin variantes      | `"none"`       | `color: null`, `size: null`         |

---

## 7. Colección: `orders`

Registro completo de todos los pedidos realizados.

**Ruta:** `orders/{orderId}`

### Documento principal

| Campo              | Tipo        | Requerido | Descripción                                                          |
|--------------------|-------------|-----------|----------------------------------------------------------------------|
| `id`               | `string`    | ✓         | ID auto-generado                                                     |
| `orderNumber`      | `string`    | ✓         | Número legible (ej: `"VOUS-2026-0042"`)                              |
| `customerId`       | `string`    | ✓         | Referencia a `users/{userId}`                                        |
| `customerSnapshot` | `map`       | ✓         | Copia de datos del cliente al momento del pedido (ver abajo)         |
| `items`            | `array`     | ✓         | Lista de productos pedidos (ver abajo)                               |
| `subtotal`         | `number`    | ✓         | Suma de items sin descuentos adicionales                             |
| `discountAmount`   | `number`    | ✗         | Monto de descuento aplicado                                          |
| `total`            | `number`    | ✓         | Total final a pagar                                                  |
| `status`           | `string`    | ✓         | Estado actual del pedido (ver estados abajo)                         |
| `paymentMethod`    | `string`    | ✓         | `"qr"` \| `"libelula"`                                               |
| `paymentProof`     | `string`    | ✗         | URL del comprobante de pago en Cloudinary (para pagos por QR)        |
| `billingInfo`      | `map`       | ✗         | Datos de facturación (ver abajo)                                     |
| `shippingInfo`     | `map`       | ✓         | Datos de envío (ver abajo)                                           |
| `isWholesale`      | `boolean`   | ✓         | Si el pedido es de tipo mayorista                                    |
| `discountCode`     | `string`    | ✗         | Código de descuento aplicado                                         |
| `adminNotes`       | `string`    | ✗         | Notas internas del administrador                                     |
| `createdAt`        | `timestamp` | ✓         | Fecha de creación del pedido                                         |
| `updatedAt`        | `timestamp` | ✓         | Última actualización                                                 |

### Estados del pedido (`status`)

| Valor                | Descripción                                 | Visible al cliente |
|----------------------|---------------------------------------------|--------------------|
| `"pending"`          | Pedido creado, esperando pago               | ✓                  |
| `"payment_sent"`     | Cliente envió comprobante de pago           | ✓                  |
| `"verifying_payment"`| Admin verificando el pago                  | ✓                  |
| `"confirmed"`        | Pago confirmado, pedido aceptado            | ✓                  |
| `"preparing"`        | Preparando el pedido para envío             | ✓                  |
| `"shipped"`          | Pedido enviado con transportista            | ✓                  |
| `"delivered"`        | Pedido entregado al cliente                 | ✓                  |
| `"cancelled"`        | Pedido cancelado                            | ✓                  |

### Mapa `customerSnapshot`

```json
"customerSnapshot": {
  "name": "María García",
  "email": "cliente@ejemplo.com",
  "phone": "71234567",
  "department": "Santa Cruz"
}
```

### Array `items`

Cada elemento del array representa un producto en el pedido:

```json
"items": [
  {
    "productId": "prod_abc123",
    "variantId": "var_xyz789",
    "productName": "Legging Urbano",
    "variantDescription": "Negro / M",
    "imageUrl": "https://res.cloudinary.com/...",
    "unitPrice": 150.00,
    "quantity": 2,
    "subtotal": 300.00,
    "isWholesalePrice": false
  }
]
```

### Mapa `billingInfo` (opcional)

```json
"billingInfo": {
  "nit": "1234567890",
  "businessName": "Empresa Ejemplo SRL",
  "email": "facturacion@empresa.com"
}
```

### Mapa `shippingInfo`

```json
"shippingInfo": {
  "fullName": "María García",
  "phone": "71234567",
  "department": "Santa Cruz",
  "city": "Santa Cruz de la Sierra",
  "address": "Av. Ejemplo 123, Barrio Centro",
  "shippingType": "local",
  "carrier": "Yango",
  "trackingInfo": "Referencia: chofer llama al llegar"
}
```

### Subcolección: `orders/{orderId}/statusHistory`

Registro cronológico de cada cambio de estado del pedido.

**Ruta:** `orders/{orderId}/statusHistory/{entryId}`

| Campo        | Tipo        | Descripción                          |
|--------------|-------------|--------------------------------------|
| `status`     | `string`    | Estado al que cambió                 |
| `changedBy`  | `string`    | UID del actor (admin o sistema)      |
| `role`       | `string`    | `"admin"` \| `"system"`             |
| `note`       | `string`    | Nota opcional del cambio             |
| `timestamp`  | `timestamp` | Momento exacto del cambio            |

---

## 8. Colección: `wholesaleRequests`

Solicitudes de clientes que desean registrarse como mayoristas.

**Ruta:** `wholesaleRequests/{requestId}`

| Campo            | Tipo        | Requerido | Descripción                                              |
|------------------|-------------|-----------|----------------------------------------------------------|
| `id`             | `string`    | ✓         | ID auto-generado                                         |
| `userId`         | `string`    | ✗         | Referencia a `users/{userId}` (si ya está autenticado)   |
| `status`         | `string`    | ✓         | `"pending"` \| `"approved"` \| `"rejected"`             |
| `businessName`   | `string`    | ✓         | Nombre del negocio                                       |
| `businessType`   | `string`    | ✓         | Tipo de negocio (tienda, distribuidora, etc.)            |
| `ownerName`      | `string`    | ✓         | Nombre del propietario/responsable                       |
| `email`          | `string`    | ✓         | Correo de contacto                                       |
| `phone`          | `string`    | ✓         | Número de contacto                                       |
| `department`     | `string`    | ✓         | Departamento del negocio                                 |
| `city`           | `string`    | ✓         | Ciudad del negocio                                       |
| `nit`            | `string`    | ✗         | NIT del negocio (opcional)                               |
| `message`        | `string`    | ✗         | Mensaje o comentario adicional                           |
| `reviewedBy`     | `string`    | ✗         | UID del admin que revisó la solicitud                    |
| `reviewedAt`     | `timestamp` | ✗         | Fecha de revisión                                        |
| `reviewNotes`    | `string`    | ✗         | Observaciones del admin al aprobar/rechazar              |
| `createdAt`      | `timestamp` | ✓         | Fecha de envío de la solicitud                           |
| `updatedAt`      | `timestamp` | ✓         | Última actualización                                     |

> Al **aprobar** una solicitud, el sistema actualiza automáticamente `users/{userId}.role = "wholesale"` y `users/{userId}.wholesaleStatus = "approved"`.

---

## 9. Colección: `blogPosts`

Publicaciones del blog / revista editorial de la marca.

**Ruta:** `blogPosts/{postId}`

| Campo          | Tipo        | Requerido | Descripción                                        |
|----------------|-------------|-----------|----------------------------------------------------|
| `id`           | `string`    | ✓         | ID auto-generado                                   |
| `title`        | `string`    | ✓         | Título del artículo                                |
| `slug`         | `string`    | ✓         | URL amigable (ej: `"tendencias-urbanas-2026"`)     |
| `excerpt`      | `string`    | ✗         | Resumen corto para listados y SEO                  |
| `content`      | `string`    | ✓         | Contenido completo (rich text / HTML)              |
| `coverImage`   | `string`    | ✗         | URL de imagen principal en Cloudinary              |
| `images`       | `string[]`  | ✗         | Imágenes adicionales del artículo en Cloudinary    |
| `isFeatured`   | `boolean`   | ✓         | Artículo fijado/destacado en la portada del blog   |
| `status`       | `string`    | ✓         | `"draft"` \| `"published"`                         |
| `tags`         | `string[]`  | ✗         | Tags del artículo (ej: `["tendencias", "urbano"]`) |
| `authorId`     | `string`    | ✓         | UID del admin autor                                |
| `authorName`   | `string`    | ✓         | Snapshot del nombre del autor                      |
| `publishedAt`  | `timestamp` | ✗         | Fecha de publicación (null si es draft)            |
| `seo`          | `map`       | ✗         | `{ title, description }` para SEO individual      |
| `createdAt`    | `timestamp` | ✓         | Fecha de creación                                  |
| `updatedAt`    | `timestamp` | ✓         | Última actualización                               |

---

## 10. Colección: `banners`

Banners administrables de la landing page.

**Ruta:** `banners/{bannerId}`

| Campo          | Tipo        | Requerido | Descripción                                            |
|----------------|-------------|-----------|--------------------------------------------------------|
| `id`           | `string`    | ✓         | ID auto-generado                                       |
| `title`        | `string`    | ✗         | Texto principal del banner                             |
| `subtitle`     | `string`    | ✗         | Texto secundario / subtítulo                           |
| `image`        | `string`    | ✓         | URL de imagen desktop en Cloudinary                    |
| `mobileImage`  | `string`    | ✗         | URL de imagen mobile en Cloudinary (opcional)          |
| `ctaText`      | `string`    | ✗         | Texto del botón CTA (ej: `"Ver Colección"`)            |
| `ctaUrl`       | `string`    | ✗         | URL de destino del botón                               |
| `ctaVisible`   | `boolean`   | ✓         | Mostrar u ocultar el botón CTA                         |
| `isActive`     | `boolean`   | ✓         | Activo / inactivo                                      |
| `sortOrder`    | `number`    | ✓         | Orden de aparición en el carrusel                      |
| `startDate`    | `timestamp` | ✗         | Fecha de inicio de visualización (campaña temporal)    |
| `endDate`      | `timestamp` | ✗         | Fecha de fin de visualización                          |
| `createdAt`    | `timestamp` | ✓         | Fecha de creación                                      |
| `updatedAt`    | `timestamp` | ✓         | Última actualización                                   |

---

## 11. Colección: `faqs`

Preguntas frecuentes administrables desde el panel.

**Ruta:** `faqs/{faqId}`

| Campo       | Tipo        | Requerido | Descripción                              |
|-------------|-------------|-----------|------------------------------------------|
| `id`        | `string`    | ✓         | ID auto-generado                         |
| `question`  | `string`    | ✓         | Pregunta                                 |
| `answer`    | `string`    | ✓         | Respuesta                                |
| `sortOrder` | `number`    | ✓         | Orden de aparición en la página          |
| `isActive`  | `boolean`   | ✓         | Activa / inactiva                        |
| `createdAt` | `timestamp` | ✓         | Fecha de creación                        |
| `updatedAt` | `timestamp` | ✓         | Última actualización                     |

---

## 12. Colección: `discounts`

Descuentos y códigos promocionales.

**Ruta:** `discounts/{discountId}`

| Campo            | Tipo        | Requerido | Descripción                                              |
|------------------|-------------|-----------|----------------------------------------------------------|
| `id`             | `string`    | ✓         | ID auto-generado                                         |
| `code`           | `string`    | ✓         | Código del cupón (ej: `"VOUS10"`) — único en el sistema  |
| `description`    | `string`    | ✗         | Descripción interna del descuento                        |
| `type`           | `string`    | ✓         | `"percentage"` \| `"fixed"`                              |
| `value`          | `number`    | ✓         | Valor del descuento (porcentaje o monto fijo en BOB)     |
| `minPurchase`    | `number`    | ✗         | Compra mínima requerida en BOB                           |
| `maxUses`        | `number`    | ✗         | Máximo de usos permitidos (null = ilimitado)             |
| `usedCount`      | `number`    | ✓         | Contador de usos actuales                                |
| `isActive`       | `boolean`   | ✓         | Activo / inactivo                                        |
| `applicableTo`   | `string`    | ✓         | `"all"` \| `"categories"` \| `"products"`               |
| `categoryIds`    | `string[]`  | ✗         | IDs de categorías aplicables                             |
| `productIds`     | `string[]`  | ✗         | IDs de productos aplicables                              |
| `startDate`      | `timestamp` | ✗         | Inicio de validez                                        |
| `endDate`        | `timestamp` | ✗         | Fin de validez (null = sin vencimiento)                  |
| `createdAt`      | `timestamp` | ✓         | Fecha de creación                                        |
| `updatedAt`      | `timestamp` | ✓         | Última actualización                                     |

---

## 13. Documento: `landingConfig`

Configuración centralizada de todas las secciones dinámicas de la landing page.

**Ruta:** `landingConfig/main`

```json
{
  "sections": {
    "featuredProducts": {
      "isVisible": true,
      "title": "Destacados",
      "productIds": ["prod_001", "prod_002", "prod_003"]
    },
    "newArrivals": {
      "isVisible": true,
      "title": "Nuevos Ingresos",
      "productIds": ["prod_010", "prod_011"]
    },
    "discountedProducts": {
      "isVisible": true,
      "title": "Ofertas",
      "productIds": ["prod_020"]
    },
    "specialCollections": {
      "isVisible": false,
      "title": "Colección Especial",
      "productIds": []
    },
    "bestSellers": {
      "isVisible": true,
      "title": "Más Vendidos",
      "productIds": ["prod_030", "prod_031"]
    }
  },
  "socialLinks": {
    "instagram": "https://instagram.com/vous.oficial",
    "facebook": "https://facebook.com/vous.oficial",
    "tiktok": "https://tiktok.com/@vous.oficial",
    "whatsapp": "https://wa.me/59171234567"
  },
  "contactInfo": {
    "email": "hola@vous.com",
    "phone": "+591 71234567",
    "address": "Santa Cruz de la Sierra, Bolivia"
  },
  "wholesaleCta": {
    "isVisible": true,
    "title": "¿Eres mayorista?",
    "subtitle": "Únete a nuestra red de distribuidores"
  },
  "updatedAt": "2026-05-14T10:00:00Z"
}
```

---

## 14. Documento: `paymentConfig`

Configuración de los métodos de pago habilitados.

**Ruta:** `paymentConfig/main`

```json
{
  "qr": {
    "isActive": true,
    "image": "https://res.cloudinary.com/.../qr-vous.png",
    "instructions": "Escanea el QR y sube tu comprobante de pago."
  },
  "libelula": {
    "isActive": false,
    "merchantId": "vous_merchant_id",
    "enableBilling": true,
    "billingInstructions": "Proporciona tu NIT y razón social para emitir factura."
  },
  "updatedAt": "2026-05-14T10:00:00Z"
}
```

> **Seguridad:** Las claves API de Libélula deben almacenarse como variables de entorno en Vercel, **nunca** en Firestore.

---

## 15. Documento: `wholesaleRules`

Reglas comerciales configurables para clientes mayoristas.

**Ruta:** `wholesaleRules/main`

```json
{
  "minimumPurchaseAmount": 500.00,
  "minimumPurchaseUnits": 6,
  "discountPercentage": 25,
  "allowSizeSelection": false,
  "restrictions": [
    "No se puede seleccionar talla individual en pedidos mayoristas.",
    "Pago debe realizarse en su totalidad antes del despacho."
  ],
  "notes": "Los precios mayoristas son exclusivos y confidenciales.",
  "updatedAt": "2026-05-14T10:00:00Z"
}
```

---

## 16. Documento: `siteConfig`

Configuración general del sitio.

**Ruta:** `siteConfig/main`

```json
{
  "siteName": "VOUS",
  "logo": "https://res.cloudinary.com/.../vous-logo.svg",
  "favicon": "https://res.cloudinary.com/.../vous-favicon.png",
  "seo": {
    "defaultTitle": "VOUS — Moda Urbana Contemporánea",
    "defaultDescription": "Descubre las últimas tendencias en moda urbana. Prendas diseñadas para la mujer moderna.",
    "keywords": ["moda", "urbana", "ropa mujer", "vous", "bolivia", "tendencias"]
  },
  "maintenanceMode": false,
  "updatedAt": "2026-05-14T10:00:00Z"
}
```

---

## 17. Reglas de Seguridad Firestore

### Lógica de acceso por colección

| Colección / Documento      | Lectura pública | Cliente autenticado | Solo mayorista aprobado | Solo admin | Solo superadmin |
|----------------------------|:-----------:|:------------------:|:-----------------------:|:----------:|:---------------:|
| `categories`               | ✓ (activas) | ✓                  | ✓                       | ✓ (todas)  | ✓               |
| `products`                 | ✓ (activos) | ✓                  | ✓ + `wholesalePrice`    | ✓ (todos)  | ✓               |
| `products/variants`        | ✓ (activas) | ✓                  | ✓                       | ✓          | ✓               |
| `banners`                  | ✓ (activos) | ✓                  | ✓                       | ✓ (todos)  | ✓               |
| `faqs`                     | ✓ (activas) | ✓                  | ✓                       | ✓ (todas)  | ✓               |
| `blogPosts`                | ✓ (publicados) | ✓               | ✓                       | ✓ (todos)  | ✓               |
| `landingConfig`            | ✓           | ✓                  | ✓                       | Escritura  | ✓               |
| `siteConfig`               | ✓           | ✓                  | ✓                       | Escritura  | ✓               |
| `users/{userId}`           | ✗           | Solo propio        | Solo propio             | ✓          | ✓               |
| `orders/{orderId}`         | ✗           | Solo propios       | Solo propios            | ✓          | ✓               |
| `wholesaleRequests`        | ✗           | Solo propios       | Solo propios            | ✓          | ✓               |
| `discounts`                | ✗           | Solo validar código| Solo validar código     | ✓          | ✓               |
| `adminUsers`               | ✗           | ✗                  | ✗                       | Solo propio| ✓               |
| `paymentConfig`            | ✓ (campos públicos) | ✓           | ✓                       | Escritura  | ✓               |
| `wholesaleRules`           | ✓ (campos públicos) | ✓           | ✓ (completo)            | Escritura  | ✓               |

### Principios clave

1. **`wholesalePrice`** y productos `isExclusiveWholesale` solo son legibles por usuarios con `role == "wholesale"` y `wholesaleStatus == "approved"`.
2. Las **rutas administrativas** se protegen verificando que el UID exista en `adminUsers` con `isActive == true`.
3. El **superadmin** es el único que puede escribir en `adminUsers`.
4. Los **clientes** solo pueden leer y escribir sus propios documentos en `users` y `orders`.
5. Los **comprobantes de pago** (imágenes en Cloudinary) deben manejarse mediante tokens firmados con tiempo de expiración.

---

## 18. Índices Recomendados

Los siguientes índices compuestos deben configurarse en Firestore para optimizar las queries más frecuentes:

| Colección    | Campos del índice                                         | Uso                                        |
|--------------|-----------------------------------------------------------|--------------------------------------------|
| `products`   | `categoryId ASC`, `isActive ASC`, `sortOrder ASC`        | Catálogo por categoría                     |
| `products`   | `isFeatured ASC`, `isActive ASC`, `sortOrder ASC`        | Sección destacados landing                 |
| `products`   | `isDiscounted ASC`, `isActive ASC`, `sortOrder ASC`      | Sección ofertas landing                    |
| `products`   | `isBestSeller ASC`, `isActive ASC`, `sortOrder ASC`      | Sección más vendidos landing               |
| `products`   | `isPresale ASC`, `isActive ASC`, `sortOrder ASC`         | Preventas                                  |
| `orders`     | `customerId ASC`, `createdAt DESC`                        | Pedidos del cliente                        |
| `orders`     | `status ASC`, `createdAt DESC`                            | Filtro por estado en admin                 |
| `orders`     | `isWholesale ASC`, `createdAt DESC`                       | Pedidos mayoristas                         |
| `orders`     | `createdAt ASC` (rango)                                   | Reportes por período                       |
| `blogPosts`  | `status ASC`, `isFeatured ASC`, `publishedAt DESC`        | Blog público                               |
| `banners`    | `isActive ASC`, `sortOrder ASC`                           | Banners activos en orden                   |
| `faqs`       | `isActive ASC`, `sortOrder ASC`                           | FAQs activas ordenadas                     |

---

## 19. Mapa Admin Panel → Colecciones

| Módulo del Admin Panel              | Colecciones / Documentos involucrados              |
|-------------------------------------|----------------------------------------------------|
| Dashboard / Estadísticas            | `orders` (agregaciones), `products`                |
| Gestión de Productos                | `products`, `products/variants`, `categories`      |
| Gestión de Categorías               | `categories`                                       |
| Gestión de Banners / Landing        | `banners`, `landingConfig`                         |
| Gestión de Pedidos                  | `orders`, `orders/statusHistory`, `users`          |
| Gestión de Clientes                 | `users`                                            |
| Solicitudes Mayoristas              | `wholesaleRequests`, `users`                       |
| Reglas Comerciales Mayoristas       | `wholesaleRules`                                   |
| Gestión de Blog                     | `blogPosts`                                        |
| Gestión de FAQ                      | `faqs`                                             |
| Descuentos y Productos Destacados   | `discounts`, `products`                            |
| Configuración de Pagos              | `paymentConfig`                                    |
| Configuración del Sitio             | `siteConfig`, `landingConfig`                      |
| Gestión de Administradores          | `adminUsers`                                       |
| Reportes y Ventas                   | `orders` (queries por fecha, estado, producto)     |

---

## 20. Mapa Landing Page → Colecciones

| Sección de la Landing Page          | Colecciones / Documentos involucrados              |
|-------------------------------------|----------------------------------------------------|
| Hero / Banners principales          | `banners`                                          |
| Sección Destacados                  | `landingConfig` → `featuredProducts`, `products`   |
| Sección Nuevos Ingresos             | `landingConfig` → `newArrivals`, `products`        |
| Sección Ofertas                     | `landingConfig` → `discountedProducts`, `products` |
| Sección Más Vendidos                | `landingConfig` → `bestSellers`, `products`        |
| Sección Colecciones Especiales      | `landingConfig` → `specialCollections`, `products` |
| Categorías navegables               | `categories` (activas, ordenadas)                  |
| Blog / Revista (preview)            | `blogPosts` (publicados, destacados)               |
| FAQ                                 | `faqs` (activas, ordenadas)                        |
| Formulario Mayoristas               | `wholesaleRequests`, `users`                       |
| Links Redes Sociales / Contacto     | `landingConfig` → `socialLinks`, `contactInfo`     |
| Header / Footer                     | `siteConfig`, `landingConfig`                      |

---

## Notas Finales

### Escalabilidad de Atributos de Productos
El campo `attributes` en `products` es intencionalmente un mapa dinámico. Para añadir un nuevo atributo (ej: `"origin": "Bolivia"`), basta con incluirlo en el documento del producto. El sistema de filtros del catálogo lo detectará automáticamente.

### Snapshots en Pedidos
Los campos `customerSnapshot` e `items[].productName` en `orders` son copias intencionales de datos al momento de la compra. Esto garantiza que el historial de pedidos sea inmutable aunque el producto o cliente cambie posteriormente.

### Reportes sin Colección Dedicada
Los reportes se calculan mediante queries directas sobre `orders` aplicando filtros de fecha, estado e `items`. Esto evita duplicar datos. Para reportes más complejos o de alto volumen en el futuro, puede considerarse una Cloud Function que agregue métricas en un documento `reports/summary`.

### Variables de Entorno (no almacenar en Firestore)
- `FIREBASE_SERVICE_ACCOUNT_KEY`
- `CLOUDINARY_API_SECRET`
- `LIBELULA_API_KEY`
- `LIBELULA_MERCHANT_SECRET`
- Todas las claves de Firebase Client SDK
