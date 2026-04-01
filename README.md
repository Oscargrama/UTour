# UTour

Plataforma de experiencias privadas y semiprivadas en Medellín y Antioquia, con flujo de reserva y pagos por Mercado Pago, contenido SEO, y backoffice ligero en Supabase.

## Qué es UTour

- **Reservas** con flujo guiado (modo de viaje → tour → fecha → datos → pago).
- **Pagos** integrados con Mercado Pago (preference + webhook).
- **Auth** en el paso de pago (Google + OTP por email).
- **Moneda de visualización** (COP / USD / EUR) con geolocalización y tasa protegida.
- **SEO** técnico con metadata por página y JSON‑LD por tour.
- **Blog** y **FAQs** como contenido de atracción.

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Mercado Pago** (Checkout + Webhook)
- **Resend** (emails transaccionales)

---

## Estructura de carpetas (resumen)

```
app/
  api/                         # Rutas API (pagos, webhooks, geo, fx, email)
  book/                        # Flujo de reservas
  checkout/result/             # Confirmación de pago
  tours/                       # Listado y detalle de tours
  blog/                        # Blog público
  faqs/                        # Preguntas frecuentes
  account/                     # Dashboard usuario
components/                    # UI/blocks reutilizables
lib/
  tours-content.ts             # Contenido base de tours (SEO + UI)
  pricing.ts                   # Reglas de pricing (COP base)
  currency.ts                  # Conversión y formato por moneda
scripts/                       # SQL de creación / seed
public/                        # Assets estáticos (logos, OG, etc.)
```

---

## Flujos clave

### 1) Reserva + Pago

1. **/book**: el usuario elige modo (grupo privado o unirse) → personas → tour → fecha → datos.
2. Se crea una **preference** en Mercado Pago.
3. Mercado Pago redirige a `/checkout/result`.
4. Webhook confirma pago y actualiza `bookings`.

### 2) Login suave antes de pagar

- Autenticación se pide justo antes de redirigir a Mercado Pago.
- Opciones: **Google OAuth** o **OTP por email**.
- La cuenta se crea automáticamente.

### 3) Moneda de visualización

- UI permite elegir COP / USD / EUR.
- Se guarda la moneda elegida para enviar emails con el mismo formato.
- Nota legal: *“Cobro final en COP. Conversión estimada.”*

---

## Pricing (reglas)

Definido en `lib/pricing.ts`:

- COP es la moneda base.
- **Grupo privado**: se cobra como 4 plazas con 20% de descuento.
- **Unirme a grupo**: se cobra por persona.
- **City Tour**: basado en propinas (no usa checkout fijo).

---

## Base de datos (Supabase)

### Tablas principales

- `bookings`
- `users`
- `testimonials`
- `blog_posts`
- `subscribers`

### Columnas importantes en `bookings`

- `payment_status`, `preference_id`, `mp_payment_id`
- `display_currency`, `display_total` (para emails con moneda elegida)
- `user_id` (relación con `users`)

---

## Variables de entorno

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Mercado Pago

- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `MERCADO_PAGO_WEBHOOK_URL` (opcional)
- `MERCADO_PAGO_USE_SANDBOX` (true/false)
- `MERCADO_PAGO_STRICT_SIGNATURE` (true/false)
- `MERCADO_PAGO_EXCLUDE_ACCOUNT_MONEY` (opcional)

### App

- `APP_URL` o `NEXT_PUBLIC_APP_URL` (base para back_urls)

### Resend (emails)

- `RESEND_API_KEY`
- `RESEND_FROM` (ej. `UTour <reservas@designlabmarketing.com>`)
- `RESEND_REPLY_TO` (opcional)

---

## Setup local (rápido)

1. Instalar dependencias:

```
npm install
```

2. Ejecutar scripts SQL en Supabase (orden sugerido):

```
scripts/001_create_tables.sql
scripts/002_seed_data.sql
scripts/003_enable_rls.sql
scripts/013_add_booking_display_currency.sql
```

3. Ejecutar el proyecto:

```
npm run dev
```

---

## Webhook de pagos

URL recomendada:

```
https://tu-dominio.com/api/payments/webhook
```

El webhook:
- valida firma HMAC de Mercado Pago
- consulta el pago por ID
- actualiza `bookings`
- envía email vía Resend

---

## SEO técnico

✅ Metadata por página  
✅ JSON‑LD por tour  
✅ Sitemap (`app/sitemap.ts`)  
✅ Verificación Search Console vía archivo en `public/`  
✅ OG images en `public/og/`

---

## Scripts de blog / SEO

Los posts se insertan via SQL en `scripts/011_*.sql`, `scripts/012_*.sql`, etc.
No se crean rutas manuales por post; el blog consume Supabase y se actualiza vía ISR.

---

## Deploy

```
git add .
git commit -m "update"
git push origin main
```

Vercel toma el deploy automáticamente.

---

## Soporte / contacto

- **WhatsApp:** +57 314 672 6226  
- **Email:** d.oinfante@gmail.com
