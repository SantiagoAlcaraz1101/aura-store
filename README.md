# Aura Store — sneakers con identidad

**Autor:** Santiago Alcaraz · **Curso:** Desarrollo Web 2026-2 · **Entrega 3**

Me incliné por Aura Store por su similitud a proyectos que he realizado anteriormente en otras materias de la universidad, por lo que el desarrollo de esta tienda online enfocada en la venta de sneakers puede ser mas ameno.

Aura Store conserva los seis pares, cinco marcas, tres categorías, imágenes y estilo visual de la primera entrega. Ahora el catálogo se consulta a una API y las solicitudes quedan guardadas en PostgreSQL, asociadas a una cuenta. No procesa cobros ni reservas automáticas; precios y existencias son de demostración. [Créditos de imágenes](docs/IMAGENES.md).

## Enlaces y estado

- [Frontend en GitHub](https://github.com/SantiagoAlcaraz1101/aura-store).
- [Backend en GitHub](https://github.com/SantiagoAlcaraz1101/aura-store-api).
- [Sitio Vercel](https://aura-store-azure.vercel.app/): versión Next publicada y catálogo conectado a Render; comprobación completa de flujos pendiente.
- [API pública en Render](https://aura-store-api.onrender.com/health): salud y catálogo verificados.
- Versión nueva local: http://127.0.0.1:3000. API local: http://127.0.0.1:4000.

La migración se publicó en `main` y Vercel desplegó automáticamente el commit `dd3a543`. Las pruebas locales no equivalen a pruebas sobre el despliegue final.

## Funciones

El visitante explora el catálogo, combina búsqueda, categoría, marca y precios, cambia de página mediante la URL y consulta tallas. La bolsa y el tema se conservan en el navegador. El usuario registrado guarda solicitudes y consulta únicamente las suyas. El administrador crea, edita y elimina productos y consulta todas las solicitudes. El borrado pide confirmación; un producto con solicitudes se conserva para proteger el historial.

## Ejecutar en local

Requisitos: Node 24 y la API funcionando con PostgreSQL.

```bash
npm ci
cp .env.example .env.local
# Configurar las variables antes de iniciar.
npm run dev
```

En PowerShell: `Copy-Item .env.example .env.local`. Abrir http://127.0.0.1:3000. Producción local: `npm run build` y `npm start`. Comprobación de tipos: `npm run typecheck`.

| Variable | Uso |
|---|---|
| NEXT_PUBLIC_API_HOST | Origen API sin `/api` final; local `http://localhost:4000` |
| JWT_SECRET | Mismo secreto privado del backend; solo para el proxy del servidor Next |

Configurar NEXT_PUBLIC_API_HOST antes de compilar porque Next lo incorpora al cliente. Nunca publicar JWT_SECRET ni ponerle el prefijo NEXT_PUBLIC. `.env.local` está excluido de Git.

## Cuentas demo del seed

| Rol | Correo | Contraseña |
|---|---|---|
| admin | admin@aura.demo | AuraAdmin!2026 |
| user | user@aura.demo | AuraUser!2026 |

Solo para el ambiente académico; se crean en el backend con SEED_DEMO_USERS=true. Usar datos de prueba.

## Organización y decisiones

`app/` define rutas que componen componentes. `src/features/` separa common, auth, products y orders, con tipos, servicios, hooks y componentes. Los componentes usan hooks; los servicios usan `common/http.ts`, el único lugar que llama a fetch. Si falla la API se muestra un error y se ofrece reintentar; no se sustituye el catálogo con datos locales.

El formulario de login valida los campos y pide a la API comprobar la contraseña con bcrypt. La API devuelve el usuario público y un JWT firmado con vencimiento. El navegador conserva el token en la cookie `aura_session`; al refrescar consulta `/api/auth/me`. El cliente HTTP adjunta `Authorization: Bearer` automáticamente. El proxy comprueba la cookie para las rutas privadas, y la API vuelve a verificar firma, expiración y permisos en cada operación.

La cookie es legible por JavaScript para enviar ese encabezado. Usa SameSite=Lax y Secure en HTTPS, pero **no es HttpOnly**: un ataque XSS podría robar el token. La protección real está también en la API. Logout elimina la cookie. Un 401 cierra la sesión y lleva al login; si ya está en login, muestra el error junto al campo sin recargarlo.

**401:** falta una sesión válida, por ejemplo borrar un producto sin token. **403:** hay sesión pero falta permiso, por ejemplo un user intenta borrar un sneaker. Ocultar Administración no basta: la API rechaza la petición aunque se envíe manualmente.

## Evidencias y uso de IA

Se verificaron compilación, tipos, paginación local, sesión tras refrescar, solicitud guardada, redirección de user fuera de Administración y logout. La API tiene 11 resultados de pruebas automatizadas y [CI aprobado](https://github.com/SantiagoAlcaraz1101/aura-store-api/actions/runs/40808114436). [Avances y pendientes](docs/AVANCES-PROGRAMADOS.md).

![Solicitud local guardada](docs/capturas/entrega-3/solicitud-local.png)

**Captura Network pendiente:** debe mostrar una petición protegida real con Authorization. La imagen anterior no reemplaza esa evidencia. Las nueve secuencias del docente deben comprobarse sobre los despliegues definitivos.

Codex apoyó la migración, implementación, pruebas y documentación. Se corrigió el límite de contraseña por bytes, una dependencia vulnerable y la conservación de marca/categoría al editar con opciones cargadas desde la API. El autor debe revisar y poder demostrar estas decisiones; no se inventan experiencias personales ni funciones.

La versión original está en `legacy/entrega-1/`, fuera de Next. Se conserva el [README personal original](docs/ENTREGA-1-README.md). El informe para la sustentación está en `docs/INFORME-SUSTENTACION.md`.