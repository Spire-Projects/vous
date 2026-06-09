---
name: vous-admin-design
description: Design and styling guide for the VOUS admin panel. Use this skill when building, modifying, or extending UI components — including layout, typography, color, motion, tables, search bars, modals, and component patterns. Ensures visual consistency with the Luminous Atelier design system: luminous white glassmorphism, vivid gold accents, ambient background radials, and editorial precision for a Bolivian fashion house.
---

This skill enforces the design system and visual language of the VOUS admin panel — a React SPA for managing a fashion brand's e-commerce backend. The aesthetic is **Luminous Atelier**: luminous glassmorphism on a warm white canvas, vivid gold accents, atmospheric background radials, and premium editorial typography.

## Tech Stack & Constraints

- **React 19** + **Vite 8** + **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first `@theme`)
- **shadcn/ui conventions** — hand-written components wrapping Radix UI primitives (Dialog, Select, DropdownMenu, Checkbox, Label, Slot)
- **react-router-dom v7** — client-side routing with protected routes
- **State**: Zustand v5, custom hooks for Firestore data
- **Icons**: `lucide-react` exclusively — always `strokeWidth={1}` or `{1.5}`
- **Fonts**: Bodoni Moda (`--font-serif`), Syne (`--font-nav`), DM Sans (`--font-sans`), all loaded from Google Fonts
- **No `components.json`** — components are hand-written shadcn-style over Radix, not CLI-generated

## Design System

### Visual Language
**Luminous Atelier** — A luminous, editorial design system for a luxury fashion house. Warm white canvas with frosted glass panels that float above atmospheric radial glows. Vivid metallic gold as the sole accent. Bold serif typography for hierarchy, geometric sans for structure. Generous whitespace. Subtle hover lifts and amber glow orbs create depth without heaviness.

### Background & Atmosphere

The body background uses layered radial gradients for depth:

```css
body {
  background-color: #FAFAF8;
  background-image:
    radial-gradient(circle at 15% 10%, rgba(201, 168, 76, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 85% 90%, rgba(180, 160, 140, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(250, 250, 248, 1) 0%, rgba(245, 242, 238, 1) 100%);
  background-attachment: fixed;
}
```

This creates:
1. **Top-left gold glow** — subtle warm radiance
2. **Bottom-right warm neutral glow** — depth without color distraction
3. **Center warm white fill** — clean canvas

### Glass Panels

All cards and panels use frosted glass:

```css
/* Standard panel */
bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5

/* Elevated / header panel */
bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl shadow-black/5
```

### Per-Panel Glow Orbs

Like the admin-chatbot, key panels have subtle decorative blobs. For VOUS, use gold tones:

```css
<div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />
<div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
```

### Color Palette

| Role | Tailwind Class | Hex / Value | Usage |
|---|---|---|---|
| Page background | `bg-vous-bg` | `#FAFAF8` | Body, main canvas |
| Glass panel | `bg-white/80` | white @ 80% | Cards, containers, tables |
| Elevated glass | `bg-white/90` | white @ 90% | Header cards, important panels |
| Solid surface | `bg-white` | `#FFFFFF` | Modals, dropdowns, select popovers |
| Surface hover | `bg-amber-50/80` | amber-50 @ 80% | Table row hover, selected items |
| Panel border | `border-white/60` | white @ 60% | Card edges (frosted catch light) |
| Input border | `border-vous-border` | `#E8E5E1` | Form elements (visible edge) |
| Text primary | `text-vous-text` | `#0D0D0C` | Headings, body, nav |
| Text secondary | `text-vous-text-secondary` | `#6B6B65` | Labels, descriptions, muted content |
| Text muted | `text-vous-text-muted` | `#9E9E94` | Placeholders, very subtle |
| Gold accent | `text-vous-gold`, `bg-vous-gold` | `#C9A84C` | Active states, primary CTAs |
| Gold hover | `text-vous-gold-bright` | `#B8960F` | Link/button hover |
| Gold subtle bg | `bg-vous-gold-subtle` | `rgba(201,168,76,0.10)` | Selected items, gold-tinted surfaces |

### Status & Semantic Colors (vivid, not muted)

| Status | Background | Text | Border | Dot Color |
|---|---|---|---|---|
| Active / Delivered / Success | `bg-emerald-50/90` | `text-emerald-700` | `border-emerald-300/80` | `bg-emerald-500` |
| Pending / Payment | `bg-amber-50/90` | `text-amber-700` | `border-amber-300/80` | `bg-amber-500` |
| Verifying | `bg-purple-50/90` | `text-purple-700` | `border-purple-300/80` | `bg-purple-500` |
| Confirmed | `bg-sky-50/90` | `text-sky-700` | `border-sky-300/80` | `bg-sky-500` |
| Preparing | `bg-indigo-50/90` | `text-indigo-700` | `border-indigo-300/80` | `bg-indigo-500` |
| Shipped | `bg-teal-50/90` | `text-teal-700` | `border-teal-300/80` | `bg-teal-500` |
| Cancelled / Danger | `bg-red-50/90` | `text-red-700` | `border-red-300/80` | `bg-red-500` |
| Inactive / Muted | `bg-gray-50/90` | `text-gray-500` | `border-gray-200/80` | — |
| Featured | — | `text-amber-600` | — | `fill-amber-400` |
| Bestseller | — | `text-emerald-600` | — | — |
| Preorder | — | `text-blue-600` | — | — |
| Special Collection | — | `text-purple-600` | — | — |

### Accent Colors for CTAs & Focus

| Role | Class | Use |
|---|---|---|
| Primary CTA | `bg-vous-gold hover:bg-vous-gold-bright` | Main action buttons |
| Danger action | `bg-red-600 hover:bg-red-700 text-white` | Delete, destructive |
| Success toggle | `text-emerald-500` | Active state toggles |
| Focus ring | `focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400` | Input/select focus |
| Selection highlight | `selection:bg-amber-200 selection:text-amber-900` | Text selection |

### Typography Scale

| Context | Classes |
|---|---|
| Page title (h1) | `font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-none tracking-tight` |
| Card title (h3) | `font-serif text-2xl font-medium leading-tight` |
| Dialog title | `font-serif text-xl` |
| StatCard value | `font-serif text-3xl lg:text-4xl font-medium tracking-tight` |
| Body text | `font-sans text-sm` or `font-sans text-[13px]` |
| Descriptions | `text-sm text-vous-text-secondary font-sans` |
| Page subtitle | `text-xs sm:text-sm font-sans tracking-wide` |
| Buttons (default) | `font-nav text-[11px] uppercase tracking-[0.15em] font-semibold` |
| Buttons (sm) | `text-[10px]` |
| Badges | `text-[10px] font-nav font-semibold uppercase tracking-wider` |
| Form labels | `text-[10px] font-nav uppercase tracking-[0.15em]` |
| Table headers | `text-[10px] font-nav uppercase tracking-[0.15em]` |
| Sidebar nav items | `text-[12px] font-nav tracking-wide` |
| StatCard label | `text-[10px] font-nav uppercase tracking-[0.2em]` |
| Kicker / overline | `text-vous-gold uppercase tracking-[0.15em] text-[10px] font-nav font-semibold` |

### Spacing & Layout

- **Sidebar width**: `w-64` (256px) fixed
- **Main content offset**: `ml-0 lg:ml-64`
- **Page padding**: `p-4 sm:p-6 lg:p-8`
- **Page header margin**: `mb-8 lg:mb-10`
- **Stat card grid gap**: `gap-4`, bottom margin `mb-8`
- **Section gap**: `gap-6` between major blocks
- **Card padding**: `p-6 md:p-8`
- **Table cell**: `px-4 py-3`
- **Input**: `px-4 py-2.5`
- **Button default**: `h-9 px-4 py-2`
- **Button sm**: `h-7 px-3`
- **Badge**: `px-2.5 py-0.5`
- **Max content width**: `max-w-[1600px]` implicit via sidebar + padding

### Border Radius (Rounded, Modern)

- **Cards / Panels**: `rounded-3xl` (24px) — soft, premium
- **Inputs / Textareas**: `rounded-2xl` (16px)
- **Buttons / Badges**: `rounded-xl` (12px)
- **Modals / Dropdowns**: `rounded-2xl`
- **Decorative blobs**: `rounded-full`
- **Status dots**: `rounded-full` w-1.5 h-1.5

### Shadows

- **Glass panels**: `shadow-xl shadow-black/5` (subtle depth)
- **Header panels**: `shadow-2xl shadow-black/5`
- **Buttons (gold)**: `shadow-lg shadow-amber-500/20` (gold glow)
- **Buttons (danger)**: `shadow-lg shadow-red-500/15`
- **Modals**: `shadow-2xl shadow-black/10`
- **Inputs**: `shadow-inner` (inset depth)

### Motion & Animation

- **Page load**: `<div className="animate-fade-in">` on content wrapper
- **Staggered cards**: Each StatCard gets `animation-delay` via inline style or nth-child
- **Hover lifts**: `hover:-translate-y-0.5 transition-all` on primary buttons and cards
- **Hover glow reveal**:
  ```css
  <div className="absolute inset-0 bg-linear-to-r from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  ```
- **Focus rings**: `focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all`
- **Spinner**: `w-5 h-5 border-2 border-vous-border border-t-vous-gold rounded-full animate-spin`
- **Status pulse**: `animate-pulse` on emerald status dots
- **Sidebar slide**: `transition-transform duration-400 ease-out`

### Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #E8E5E1; border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: #D4D1CC; }
```

## UI Component API

### Table Pattern

Tables are the primary data display pattern. Every table must follow this structure:

```tsx
<div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
  {/* Toolbar */}
  <div className="p-4 border-b border-white/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
    <div className="relative flex-1 max-w-xs">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vous-text-secondary" />
      <Input
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="pl-10 rounded-2xl"
      />
    </div>
    <div className="flex flex-wrap gap-1.5">
      {TABS.map(tab => (
        <Button key={tab.value} size="sm" variant={activeTab === tab.value ? "gold" : "ghost"} onClick={() => setActiveTab(tab.value)}>
          {tab.label}
        </Button>
      ))}
    </div>
  </div>

  {/* Loading / Error / Empty / Data states */}
  {loading ? (
    <div className="flex items-center justify-center py-20">
      <span className="inline-block w-5 h-5 border-2 border-vous-border border-t-vous-gold rounded-full animate-spin" />
    </div>
  ) : error ? (
    <div className="m-4 p-4 bg-red-50/90 border border-red-200/80 text-red-700 text-sm font-sans rounded-2xl">
      {error}
    </div>
  ) : filtered.length === 0 ? (
    <div className="py-20 text-center">
      <p className="text-sm text-vous-text-secondary font-sans">No se encontraron resultados.</p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/40">
            {["Columna 1", "Columna 2", "Acciones"].map(h => (
              <th key={h} className="text-left text-[10px] font-nav uppercase tracking-[0.15em] text-vous-text-secondary px-4 py-3.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/30">
          {filtered.map(item => (
            <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
              <td className="px-4 py-3 font-sans text-sm text-vous-text">{item.name}</td>
              <td className="px-4 py-3">
                <Badge variant={item.isActive ? "active" : "inactive"}>
                  {item.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm"><Pencil size={14} /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600"><Trash2 size={14} /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Footer count */}
  {!loading && !error && (
    <div className="px-4 py-3 border-t border-white/40">
      <p className="text-[11px] text-vous-text-secondary font-nav">
        Mostrando {filtered.length} de {items.length} resultados
      </p>
    </div>
  )}
</div>
```

**Key table conventions:**
- Always wrap in `overflow-x-auto` div for horizontal scroll
- Use `border-white/40` for subtle horizontal separators
- Use `divide-white/30` for soft row dividers
- Hover row: `hover:bg-amber-50/40` (warm gold-tinted hover)
- Header cells: `px-4 py-3.5` (slightly taller than data cells)
- Empty state centered with `py-20`
- Loading spinner centered with `py-20`

### Search Bar Pattern

```tsx
<div className="relative flex-1 max-w-xs">
  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vous-text-secondary pointer-events-none" />
  <Input
    placeholder="Buscar..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="pl-10 rounded-2xl bg-white/90 border-vous-border shadow-inner focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
  />
</div>
```

**Key search bar conventions:**
- `max-w-xs` (320px) — search doesn't need to be full width
- Leading `Search` icon from lucide-react, `size={14}`, positioned absolutely
- `pl-10` for icon clearance
- `rounded-2xl` to match other inputs
- Focus ring in gold/amber

### Modal / Dialog Pattern

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-md rounded-2xl">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Optional description.</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 pt-2">
      {/* Form content */}
      <div className="space-y-1">
        <Label htmlFor="field">Field Label</Label>
        <Input id="field" value={val} onChange={e => setVal(e.target.value)} className="rounded-2xl" />
      </div>
    </div>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="gold" onClick={handleSave}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Key modal conventions:**
- `rounded-2xl` for the dialog content
- Use `DialogFooter` for action buttons (right-aligned)
- Cancel button: `variant="ghost"` (subtle)
- Confirm/Save button: `variant="gold"` (prominent)
- Form fields use `space-y-4` with `space-y-1` for label+input pairs

### Glass Card / Panel Pattern

Every content section uses this pattern:

```tsx
<section className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 p-6 md:p-8 relative overflow-hidden group">
  {/* Decorative glow orb */}
  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 blur-[100px] rounded-full pointer-events-none" />

  {/* Hover gradient reveal */}
  <div className="absolute inset-0 bg-linear-to-r from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

  {/* Content — always relative z-10 */}
  <div className="relative z-10">
    <h2 className="font-serif text-2xl font-medium text-vous-text mb-6">Section Title</h2>
    {/* content */}
  </div>
</section>
```

### Button Variants

| Variant | Class | Use |
|---|---|---|
| `gold` (primary) | `bg-vous-gold hover:bg-vous-gold-bright text-white shadow-lg shadow-amber-500/20 rounded-xl font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-all hover:-translate-y-0.5` | Main actions, save, create |
| `default` (dark) | `bg-vous-text hover:bg-vous-gold text-white rounded-xl font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-all hover:-translate-y-0.5` | Tab filters (active) |
| `ghost` (subtle) | `text-vous-text-secondary hover:text-vous-text hover:bg-amber-50/60 rounded-xl font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors` | Tab filters (inactive), subtle actions |
| `outline` | `border border-vous-text text-vous-text hover:bg-vous-text hover:text-white rounded-xl font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-all` | Secondary actions |
| `danger` | `bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/15 rounded-xl font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-all hover:-translate-y-0.5` | Delete, destructive |
| `outline-gold` | `border border-vous-gold text-vous-gold hover:bg-vous-gold hover:text-white rounded-xl font-nav text-[11px] uppercase tracking-[0.15em] font-semibold transition-all` | Premium secondary |
| `icon` / `icon-sm` | Same as above + `h-9 w-9` or `h-7 w-7` | Icon-only buttons |

### StatCard Pattern

```tsx
<div className="group bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl p-6 shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber-500/5 relative overflow-hidden">
  {/* Gold glow orb */}
  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

  <div className="relative z-10 flex items-start justify-between">
    <div className="flex-1">
      <p className="text-[10px] font-nav uppercase tracking-[0.2em] text-vous-text-secondary">
        {label}
      </p>
      <p className="font-serif text-3xl lg:text-4xl font-medium text-vous-text mt-3 tracking-tight">
        {value}
      </p>
      {change && (
        <p className={`text-[11px] font-nav tracking-wide mt-2 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {change}
        </p>
      )}
    </div>
    {icon && (
      <div className="text-vous-gold/40 group-hover:text-vous-gold/80 transition-colors duration-300 ml-3">
        {icon}
      </div>
    )}
  </div>
</div>
```

### Sidebar Pattern

Dark anchor sidebar with frosted glass panels on white content:

```tsx
// Sidebar: deep charcoal, fixed left
<aside className="fixed top-0 left-0 h-full w-64 bg-[#0D0D0C]/95 backdrop-blur-xl flex flex-col z-40 border-r border-white/5">
  {/* Gold accent line at top */}
  <div className="absolute top-0 left-0 right-0 h-[2px] bg-vous-gold" />

  {/* Logo section */}
  <div className="px-6 py-7 border-b border-white/5">
    {logoUrl ? <img ... /> : <p className="font-serif text-xl text-white">{name}</p>}
    <p className="text-[10px] font-nav uppercase tracking-[0.25em] text-vous-gold mt-2">Admin Portal</p>
  </div>

  {/* Navigation */}
  <nav className="flex-1 overflow-y-auto py-5">
    {items.map(item => (
      <NavLink
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 mx-3 text-[12px] font-nav tracking-wide rounded-xl transition-all duration-200 ${
            isActive
              ? "bg-vous-gold/20 text-vous-gold shadow-lg shadow-amber-500/10"
              : "text-white/50 hover:text-white hover:bg-white/5"
          }`
        }
      >
        <Icon size={15} strokeWidth={1.5} />
        {label}
      </NavLink>
    ))}
  </nav>
</aside>
```

## Routing

All routes are nested under `ProtectedRoute` + `AdminLayout`:

| Path | Page | Auth |
|---|---|---|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public (one-time) |
| `/` | DashboardPage | Protected |
| `/pedidos` | OrdersPage | Protected |
| `/inventario` | InventoryPage | Protected |
| `/categorias` | CategoriesPage | Protected |
| `/clientes` | CustomersPage | Protected |
| `/mayoristas` | WholesalePage | Protected |
| `/blog` | BlogPage | Protected |
| `/faq` | FaqPage | Protected |
| `/banners` | BannersPage | Protected |
| `/landing-secciones` | LandingSectionsPage | Protected |
| `/descuentos` | DiscountsPage | Protected |
| `/reportes` | ReportsPage | Protected |
| `/configuracion` | SettingsPage | Protected |
| `/usuarios` | AdminUsersPage | superadmin only |

## Design Principles

- **Luminous depth** — Glass panels float above a warm, radially-lit canvas. Blur + subtle shadow create elevation without darkness.
- **Gold as the sole accent** — One vivid metallic accent. Used deliberately for CTAs, active states, and key indicators. Never diluted with secondary accent colors.
- **Typography hierarchy** — Bodoni Moda for prestige, Syne for editorial structure, DM Sans for readability.
- **Hover as delight** — Subtle lifts (`-translate-y-0.5`), glow reveals, and color transitions reward interaction.
- **Generous whitespace** — Luxury lives in the margins. Cards have `p-6 md:p-8`. Pages have `p-4 sm:p-6 lg:p-8`.
- **Rounded modernism** — `rounded-3xl` panels, `rounded-2xl` inputs, `rounded-xl` buttons. Soft forms with sharp typography.
- **State coverage** — Every data view handles loading, error, empty, and populated states.
- **Ambient glow orbs** — Each key panel has a subtle gold/amber decorative blur at 5-10% opacity. Atmospheric, not distracting.
