# Entrega 3 — plan verificable

Fecha de inicio: 27 de octubre de 2026. Fecha indicada por el docente: jueves 29 de octubre, antes de la clase.

Se continúa Aura Store, sus seis productos, cinco marcas, tres categorías, imágenes, textos y paleta. El repositorio actual conserva su historial y será el frontend; `../aura-store-api` será un repositorio independiente para el backend. La Entrega 1 se conserva como referencia, fuera de la aplicación Next.

## Contrato

- API: Express + TypeScript; capas domain, application, infrastructure, interface. Prisma solo en infrastructure.
- PostgreSQL: users, brands, categories, products, product_sizes y orders. Orders contiene userId y productId como claves foráneas: una solicitud por modelo y talla, como el formulario original. Es una solicitud real persistida, no un pago ni una reserva automática de stock.
- Usuarios: bcrypt, email único normalizado, roles user/admin; registro público siempre user; JWT solo id y role, además de iat/exp del protocolo.
- Rutas: register/login, products paginado `{ pagination, data }`, detalle, CRUD admin; POST orders, GET orders/mias y GET orders admin. `/api/auth/me` permite recuperar la sesión comprobando el usuario real; `/api/catalog-options` entrega marcas y categorías desde PostgreSQL.
- Validación de body, params y query; códigos 400/401/403/404/409; errores públicos sin stack. CORS restringido al frontend configurado.
- Frontend: Next App Router + TypeScript + Tailwind. Features common/auth/products/orders con domain/services/hooks/components. Fetch solo en el cliente HTTP, llamado por servicios y hooks. Páginas únicamente componen.
- Sesión: token en cookie accesible al cliente para enviar Authorization desde el navegador (evidencia Network). Cookie Secure en HTTPS, SameSite=Lax; riesgo XSS documentado, no se afirma HttpOnly. Proxy verifica firma/expiración con JWT_SECRET privado; API vuelve a comprobar autenticación y rol.
- Rutas `/login`, `/registro`, `/mis-solicitudes`, `/admin`; 404 propia. Formulario protegido que guarda la solicitud a nombre del token.
- Conservación de bolsa y modo oscuro. Filtros combinados de texto, categoría, marca y rango de precio; página en URL.

## Etapas y commits reales

1. Registrar alcance y configurar proyectos (frontend/backend por separado).
2. Backend: entidades, puertos, PostgreSQL, migración y seed original.
3. Backend: casos de uso, seguridad, routers, validaciones y errores.
4. Backend: pruebas de middlewares e integración contra PostgreSQL real.
5. Frontend: cliente HTTP, sesión persistente, proxy y formularios auth.
6. Frontend: migración visual, catálogo remoto y bolsa.
7. Frontend: solicitudes persistentes, mis solicitudes y administración CRUD.
8. Verificación: build/types/tests, flujos reales, tamaños y evidencia Network.
9. Documentación específica, cuentas demo, despliegue y comprobaciones de producción.

Los commits y pushes se registran cuando ocurren. No se alteran fechas ni se reescribe el historial. Un push a main del frontend puede actualizar el Vercel existente; no se enviará una etapa incompleta que rompa la publicación.

## Rúbrica exacta

API capas/CRUD/paginación 15; PostgreSQL/Prisma/modelo 10; JWT 15; autorización 10; validaciones 5; migración Next/Tailwind 10; features/consumo 10; sesión 10; rutas protegidas 5; despliegue 5; Git/README 5. Total 100.

Bonos previstos: proxy y cookie +3; filtros combinados +2; pruebas de middlewares +3; confirmación de borrado +1. No se promete subida de archivos ni puntos no implementados. Máximo de bonos de la consigna +10, total limitado a 100.

## Condiciones de entrega

No usar un catálogo de respaldo en frontend si falla la API. No usar SQLite ni memoria para afirmar PostgreSQL. No inventar despliegues, fechas de push, capturas Network o experiencias personales en README. Probar las nueve secuencias del docente en producción cuando estén disponibles las cuentas/plataformas. Entrega por Moodle y correo: repos backend/frontend + URL API + URL Vercel.
