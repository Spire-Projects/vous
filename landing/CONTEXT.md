# CONTEXT.md — Contexto del Proyecto VOUS

## Descripción General

**VOUS** es una plataforma de e-commerce para una marca de moda urbana contemporánea orientada al mercado boliviano y latinoamericano. El sistema busca digitalizar y escalar la experiencia de compra, mayoreo y gestión de contenido de la marca, reflejando su identidad visual premium, minimalista y editorial.

---

## Misión

> Crear una experiencia de moda auténtica, exclusiva y cercana que inspire a las personas a expresar su identidad a través del estilo.

## Visión

> Ser el referente de moda urbana contemporánea en Bolivia y Latinoamérica, combinando calidad, tendencia e inclusión.

---

## Valores de Marca

| Valor        | Descripción                                                           |
| ------------ | --------------------------------------------------------------------- |
| Exclusividad | Productos y experiencias que se sienten únicos y seleccionados        |
| Comunidad    | Construcción de una tribu de clientes fieles conectados por el estilo |
| Autenticidad | Identidad de marca coherente y genuina en todos los canales           |
| Estilo       | Tendencia urbana con sello propio                                     |
| Inclusión    | Tallas ampliadas y diseño accesible para todos los cuerpos            |
| Calidad      | Materiales y acabados premium                                         |
| Compromiso   | Servicio cercano, puntual y transparente                              |

---

## Identidad Visual

- **Estilo**: Minimalista, editorial, premium
- **Tipografía**:
  - Títulos: Serif elegante (ej. Playfair Display, Cormorant)
  - Navegación / Cuerpo: Sans-serif contemporáneo (ej. Inter, DM Sans)
- **Paleta de colores**:
  - Warm White: `#FAF8F5`
  - Cream: `#F0EBE3`
  - Soft Black: `#1A1A1A`
  - Metallic Gold: `#C9A84C`
  - Neutral Gray: `#9E9E9E`

---

## Objetivo del Proyecto

Desarrollar un e-commerce full-featured alineado a la identidad de VOUS que permita:

1. Compra online de productos por clientes finales
2. Gestión de pedidos por mayoreo para compradores B2B
3. Administración completa de catálogo, usuarios, pedidos y contenido
4. Blog y contenido de marca para posicionamiento y comunidad
5. Sistema de descuentos y cupones
6. Panel de analíticas y reportes para administradores

---

## Audiencia Objetivo

| Segmento           | Descripción                                                       |
| ------------------ | ----------------------------------------------------------------- |
| Cliente Final      | Persona que compra moda para uso personal, urbana, 18–45 años     |
| Mayorista          | Revendedor o negocio que compra en volumen con precios especiales |
| Administrador      | Equipo interno de VOUS que gestiona el catálogo y los pedidos     |
| Superadministrador | Responsable técnico y de configuración global de la plataforma    |

---

## Roles del Sistema

```
customer       → Navega, compra, gestiona su cuenta y pedidos
wholesaler     → Accede a precios de mayoreo, realiza pedidos en volumen
admin          → Gestiona catálogo, pedidos, usuarios y contenido
superadmin     → Configuración global, acceso total, gestión de admins
```

---

## Módulos Principales

1. **Catálogo de Productos** — Listado, filtros, detalle, variantes, imágenes
2. **Carrito y Checkout** — Flujo de compra completo con pasarela de pago
3. **Autenticación** — Registro, login, recuperación de contraseña, roles
4. **Panel de Usuario** — Perfil, historial de pedidos, favoritos
5. **Panel Admin** — CRUD de productos, categorías, pedidos, usuarios
6. **Blog** — Publicaciones editoriales con editor de texto enriquecido
7. **Mayoreo** — Precios especiales, gestión de cuentas B2B
8. **Descuentos** — Cupones, promociones por categoría o producto
9. **Configuración del Sitio** — Banners, textos globales, redes sociales
10. **Analíticas** — Dashboard con métricas de ventas e inventario

---

## Gestión del Proyecto

- **Herramienta**: Linear — proyecto "Ecommerce VOUS" en equipo Spire Solutions
- **Metodología**: Scrum con sprints definidos
- **CI/CD**: GitHub + GitHub Actions → Vercel
- **Ambientes**: `development`, `staging`, `production`
