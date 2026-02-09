# YouTour - Landing Page

Una plataforma completa para tours privados en Medellín y Guatapé, Colombia.

## Características

### Frontend
- Landing page moderna con diseño responsive
- Sistema de reservas con formularios validados
- Blog con SEO optimizado
- Newsletter con suscripción por email
- Testimonios de clientes
- FAQs dinámicas
- Botón flotante de WhatsApp

### Backend
- Base de datos PostgreSQL con Supabase
- Autenticación con Supabase Auth
- Row Level Security (RLS) para protección de datos
- API routes para envío de emails
- Webhooks para eventos de base de datos

### Admin Dashboard
- Panel de administración protegido
- Gestión de reservas con actualizaciones de estado
- Aprobación de testimonios
- Creación y edición de posts de blog
- Vista de suscriptores del newsletter

### Integraciones
- **Supabase**: Base de datos y autenticación
- **Email**: Sistema de templates para confirmaciones y bienvenida
- **Analytics**: Preparado para Google Analytics y Facebook Pixel
- **WhatsApp**: Integración directa con botón flotante

## Tecnologías

- Next.js 16 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth)
- shadcn/ui components

## Configuración

### Variables de Entorno

Las siguientes variables están configuradas automáticamente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Otras variables de Supabase para conexión directa

**Nota:** Los webhooks de Supabase son opcionales. La aplicación funciona completamente sin ellos. Solo son necesarios si quieres notificaciones automáticas cuando ocurren eventos en la base de datos.

### Instalación

1. Clona el repositorio
2. Ejecuta los scripts SQL en orden:
   - `scripts/001_create_tables.sql`
   - `scripts/002_seed_data.sql`
   - `scripts/003_enable_rls.sql`
3. Instala dependencias: `npm install`
4. Ejecuta el proyecto: `npm run dev`

### Primer Usuario Admin

Para crear tu primer usuario administrador:

1. Ve a la sección de Authentication en Supabase
2. Crea un nuevo usuario con email y contraseña
3. Usa esas credenciales en `/login`

## Estructura del Proyecto

\`\`\`
/app
  /admin          - Dashboard de administración
  /blog           - Blog público
  /api            - API routes (emails, webhooks)
/components       - Componentes reutilizables
/lib              - Utilidades y configuración
/scripts          - Scripts SQL para base de datos
\`\`\`

## Próximos Pasos

### Integraciones Recomendadas

1. **Email Service**: Integrar Resend o SendGrid para envío real de emails
   - Agrega `RESEND_API_KEY` en la sección Vars del sidebar
2. **Analytics**: Agregar Google Analytics 4
3. **Pagos**: Integrar Stripe para pagos online
4. **CRM**: Conectar con sistema de gestión de clientes
5. **Webhooks** (Opcional): Configurar webhooks en Supabase Dashboard para notificaciones en tiempo real

### Mejoras Futuras

- Sistema de reviews con verificación
- Calendario de disponibilidad en tiempo real
- Multi-idioma (español/inglés)
- Galería de fotos de tours
- Sistema de cupones y descuentos

## Contacto

Para soporte: oscar@youtour.com
