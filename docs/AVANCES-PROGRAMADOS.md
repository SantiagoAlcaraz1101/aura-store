# Avances reales y revisiones programadas — Entrega 3

## Acuerdo del 28 de octubre de 2026

El usuario pidió distribuir los próximos commits en horarios futuros. Se programaron cuatro revisiones de trabajo, separadas por 30 minutos, mediante la automatización de este chat `verificar-y-registrar-avances-de-aura-store`. Cada revisión debe completar y verificar una unidad real antes de registrarla; el horario no representa una duración de autoría. No se alteran fechas ni se reescribe el historial. Los resultados de cada revisión se registran abajo.

Al iniciar las revisiones, los commits existentes del frontend terminaban en `a57832f` y los del backend en `b97c68e`; conservan sus fechas reales del 27 de octubre. El frontend tiene origin `https://github.com/SantiagoAlcaraz1101/aura-store`. El backend está en `../aura-store-api`, con su repositorio independiente `https://github.com/SantiagoAlcaraz1101/aura-store-api` creado y publicado durante la primera revisión.

## Primera revisión programada: backend

Terminada la unidad de pruebas/seguridad/CI el 28 de octubre. Commit `6f42bc7`, creado a las **21:43:42 de Colombia**, y primer push del backend a las **21:44**, según el inicio de GitHub Actions a las 02:44:12 UTC del día 29. El primer push incluye los tres commits previos reales del día 27 y este cuarto commit; no se afirma que esos commits anteriores se hubieran publicado antes.

Se revisaron 32 archivos publicables y los tres commits previos buscando coincidencias con los secretos privados locales y tokens GitHub, sin coincidencias. `.env` y `.local/` siguen excluidos. Se añadió cobertura HTTP para contraseñas de 37 caracteres `ñ` (74 bytes), que deben rechazarse en registro y login; las 11 pruebas y la comprobación TypeScript de pruebas volvieron a pasar. Se creó el repositorio público y se publicó `main` con push normal. El árbol del backend quedó limpio.

Ejecución CI: `https://github.com/SantiagoAlcaraz1101/aura-store-api/actions/runs/40808114436`. **Resultado final: success**, confirmado con `gh run watch --exit-status`. GitHub ejecutó el workflow con PostgreSQL efímero para el commit `6f42bc7`. Este repositorio no implica que exista un despliegue de la API; la API sigue local en el puerto 4000.

La próxima revisión corresponde al frontend. No repetir ni reescribir el commit del backend si no hay cambios nuevos o fallos pendientes.

## Verificación realizada hoy

- `npm run build` del frontend: correcto, seis rutas y proxy compilados para producción.
- Backend: Prisma genera el cliente y TypeScript compila. `npm run typecheck` y `npm run typecheck:tests`: correctos.
- `npm test`: 11 resultados correctos (cinco pruebas de middlewares, una suite y cinco subpruebas de integración con PostgreSQL real).
- `npm audit`: cero vulnerabilidades después de actualizar la dependencia transitiva `deepmerge-ts` mediante override. Se verificaron generación, migración y seed con esa resolución.
- El login ahora limita la contraseña por bytes, igual que el registro y el límite de bcrypt.
- Se añadió un workflow de CI con PostgreSQL efímero. En la primera revisión programada se ejecutó en GitHub y terminó correctamente; la ejecución está enlazada arriba.
- Navegador contra build de producción local: catálogo remoto de seis productos, página 2 por URL, login demo, sesión después de refrescar, solicitud guardada y visible en Mis solicitudes, user redirigido de `/admin` al inicio, logout y ruta privada redirigida a `/login`.
- Evidencia real: `docs/capturas/entrega-3/solicitud-local.png`. Es una captura local de la aplicación; **no** es la captura Network exigida ni una prueba del despliegue.

## Entorno local para continuar

PostgreSQL 17 usa el clúster aislado `../aura-store-api/.local/postgres-data`. El puerto 55432 falló al reiniciar Windows; se arrancó en **55433** y se actualizó exclusivamente el `.env` ignorado. No se modificó la instancia PostgreSQL del sistema. Si fuera necesario iniciarlo:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' -D 'C:\Users\user\OneDrive\Escritorio\aura-store-api\.local\postgres-data' -l 'C:\Users\user\OneDrive\Escritorio\aura-store-api\.local\postgres.log' -o '-h 127.0.0.1 -p 55433' start
```

API: `npm run dev` desde el backend, puerto 4000. Frontend: `npm run start` desde este repositorio, puerto 3000, usando el build ya generado. Reiniciar el servidor Next después de cambios y recompilar, o usar `npm run dev`. En Windows, detener el proceso de la API antes de ejecutar `prisma generate`/`npm run build`: el proceso en uso bloquea la DLL del cliente Prisma.

Las variables privadas siguen en `.env` / `.env.local`, ignoradas por Git. No imprimirlas, adjuntarlas ni incluirlas en commits. Las cuentas demo académicas son `admin@aura.demo` / `AuraAdmin!2026` y `user@aura.demo` / `AuraUser!2026`.

## Etapas siguientes

1. **Backend — completada:** pruebas/CI, validación de contraseña y resolución de dependencia registradas y publicadas en `6f42bc7`. GitHub Actions pasó. Mantener trazabilidad del momento real de publicación.
2. **Frontend:** probar registro y duplicado visible, CRUD completo en UI admin, manejo de 401, 404, estados vacío/error, bolsa y tamaños 320/390/768/1440. Revisar especialmente los selects de marca y categoría del editor: usan defaultValue antes de cargar sus opciones y podrían perder la selección al editar. Corregir solo lo confirmado, recompilar y registrar evidencia. Respetar AGENTS.md y leer las guías Next pertinentes antes de editar.
3. **Documentación y despliegue:** conservar el README personal previo y la entrega HTML original, completar ambos README con decisiones verídicas, cuentas demo, entorno y captura auténtica de Network mostrando Authorization. Configurar GitHub/Vercel y Render o Railway, variables de entorno, CORS y auto deploy de main. La conexión de las plataformas y la elección/creación de PostgreSQL de producción siguen pendientes. No inventar URLs. No publicar main del frontend con una API inexistente o Vercel todavía configurado para el sitio estático anterior.
4. **Cierre:** verificar las nueve secuencias del docente sobre URLs de producción, registrar resultados reales y comunicar los cuatro enlaces. No enviar correo ni entregar en Moodle sin instrucción explícita. Si falta acceso externo, declarar el pendiente en vez de marcarlo terminado. Pausar la automatización al completar el trabajo; su programación tiene cuatro ejecuciones, no seguimiento indefinido.

## Límites de la evidencia

Las pruebas de integración crean usuarios y solicitudes identificados como pruebas en la base local; sus productos temporales de CRUD se eliminan. El servicio almacena solicitudes, no cobra ni reserva existencias. El token está en cookie accesible a JavaScript para enviar Bearer; documentar el riesgo XSS, sin afirmar que sea HttpOnly. El README debe distinguir ayuda de IA de decisiones o experiencias personales del autor.

## Informe final solicitado por el usuario

Antes de cerrar el trabajo, entregar `docs/INFORME-SUSTENTACION.md`: informe detallado en español, principalmente descriptivo, para apoyar la sustentación ante el docente. Debe explicar el antes y después de Aura Store, qué se hizo y cómo, qué vive un visitante, un usuario y un administrador, las razones de las decisiones, el almacenamiento y protección de datos con palabras sencillas, las pruebas realizadas, los problemas corregidos y el apoyo de IA. Añadir un recorrido de demostración y preguntas posibles del profesor con respuestas basadas en el funcionamiento real. Relacionar evidencias auténticas; distinguir pruebas locales de producción y declarar los pendientes. No inventar experiencias personales ni afirmar que el proyecto está completo antes de comprobar los requisitos. Este informe es parte del cierre, además de los README.

## Publicación urgente del 29 de octubre

El usuario pidió cancelar la espera entre commits y publicar inmediatamente por la presentación y la batería. Se registraron `12d0e34` (corrección de selects, creación/edición comprobadas en navegador local) y `dd3a543` (configuración Vercel y archivo de Entrega 1). Build de Next completado correctamente. Push normal de HEAD a main; Vercel lo publicó automáticamente y el navegador mostró el catálogo remoto. Render responde 200, seis productos y CORS del dominio Vercel. Variables de producción NEXT_PUBLIC_API_HOST y JWT_SECRET configuradas; la copia del secreto fue autorizada expresamente. No se publica su valor.

API: https://aura-store-api.onrender.com. Frontend: https://aura-store-azure.vercel.app. Se creó docs/INFORME-SUSTENTACION.md con evidencia y pendientes. Siguen pendientes Network real y la batería completa de pruebas de producción; la autorización GitHub de Render aún debe comprobarse. El producto temporal local AURA-UI-20261029 se creó/editó, pero no se confirmó su borrado.
