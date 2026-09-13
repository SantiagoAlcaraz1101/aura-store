# Verificación de Aura Store

Ejecutada el 13 de septiembre de 2026. Entorno: Windows, Node.js 24.15.0 y navegador integrado Chromium. Estas son verificaciones realizadas, no una lista de resultados supuestos.

## Reglas de negocio

Comando: `node --test tests/store.test.mjs`.

**12 pruebas aprobadas, 0 fallidas.** Incluyen relaciones por ID y stock válido; filtros combinados y búsqueda con acentos; orden por precio sin mutar el catálogo; resultados vacíos; falta de talla; talla agotada; producto desconocido; agrupación por producto/talla; subtotal; límite de stock; eliminación al llegar a cero; restauración de almacenamiento corrupto y duplicado; validación de requeridos, email, longitudes, consentimiento y talla del modelo elegido.

No se añaden dependencias al sitio para ejecutar las pruebas. Se usa `node:test` y `node:assert/strict`, incluidos en Node.

## HTML

El HTML fuente se envió al servicio Nu de W3C (`https://validator.w3.org/nu/?out=json`). Respuesta: versión 26.9.9, `messages: []`, idioma `es`. Evidencia: [validacion-html.json](validacion-html.json).

El primer pase detectó `aria-label` en un `div` genérico en la franja de marcas. Se añadió `role="group"` y el segundo pase pasó sin errores ni advertencias. También se añadió un encabezado inicial al diálogo para que `aria-labelledby` tuviera un destino antes de cargar JavaScript. La comprobación del servicio se refiere al HTML fuente, no constituye una certificación de todo estado dinámico de la aplicación.

## Pruebas en navegador

| Flujo | Resultado observado |
| --- | --- |
| Carga inicial | 6 tarjetas; las 7 imágenes visibles en DOM (hero más catálogo) cargaron, con `naturalWidth > 0`. |
| Categoría Esenciales | 2 resultados. |
| Esenciales + Nike | Solo Air Force 1. |
| Búsqueda `zzzz` | Estado vacío visible; «Ver todos los pares» restableció 6 resultados. |
| Añadir sin talla | Mensaje «Elige una talla disponible.»; no añadió productos. |
| Dunk talla 41 | Botón deshabilitado por stock 0. |
| Dunk talla 43 | Permitió 1 unidad y deshabilitó incremento (stock 1). |
| Recargar bolsa | Conservó el producto, talla y cantidad. |
| Consultar desde bolsa | Precargó Dunk y EU 43 en el formulario. |
| Formulario incompleto | Errores junto a nombre, correo, ciudad, mensaje y consentimiento; foco en nombre. |
| Formulario válido | Confirmación local, cero campos inválidos y aviso explícito de que no envió/cobró/reservó. |
| Eliminar línea | Bolsa vacía con acción «Seguir explorando». |
| Tema | Cambio claro/oscuro; cada preferencia se mantuvo al recargar. |
| Menú móvil | Abrió con `aria-expanded=true`; Escape lo cerró y devolvió foco al botón. |
| Navegación móvil | Elegir «Sneakers» cerró el menú y llevó al catálogo. |
| Diálogo y teclado | Foco dentro del diálogo; Escape lo cerró y devolvió foco al botón que lo abrió. |
| Consola | Sin errores ni advertencias en la lectura de los flujos probados. |

Se usaron exclusivamente datos ficticios: Cliente Demo, demo@example.com, Bogotá. Los datos del formulario no se guardan en localStorage ni se envían por red. Se dejó la bolsa vacía y el tema claro al terminar.

## Responsive y evidencia visual

| Viewport | Columnas del catálogo | Ancho de documento medido | Overflow horizontal |
| --- | --- | --- | --- |
| 320 × 740 | 1 | 305 px | No |
| 390 × 844 | 2 | 375 px | No |
| 768 × 1024 | 2 | 753 px | No |
| 1440 × 1000 | 3 | 1425 px | No |

La diferencia de 15 px corresponde a la barra de desplazamiento del navegador de pruebas. Se inspeccionaron capturas de escritorio, móvil, catálogo móvil, tablet y modo oscuro. En tablet se retiró un rótulo vertical decorativo y se redujo la fotografía para evitar interferencia con el nombre del producto.

- [Escritorio, página completa](capturas/escritorio.png)
- [Escritorio, vista inicial](capturas/escritorio-vista.png)
- [Móvil, vista inicial](capturas/movil.png)
- [Móvil, catálogo](capturas/catalogo-movil.png)
- [Tablet, vista inicial](capturas/tablet.png)
- [Modo oscuro](capturas/oscuro.png)

El capturador no pudo generar la página completa de tablet; se guardó la vista visible. No se presenta ese intento fallido como una captura completa.

## Alcance y limitaciones

- `prefers-reduced-motion`, etiquetas, semántica, `aria-describedby`, focos y contraste de la paleta están implementados; no se hizo una certificación WCAG ni una auditoría con lector de pantalla.
- El bloqueo de localStorage se maneja con `try/catch`; la recuperación de datos corruptos se probó en funciones puras. No se alteraron los permisos del navegador para simular bloqueo.
- No se probaron Safari, Firefox ni dispositivos físicos. Los tamaños se verificaron mediante viewport de Chromium.
- GitHub, Vercel, redeploy con push y disponibilidad pública siguen pendientes y no se afirman probados.
- Las pruebas unitarias no sustituyen una nueva revisión del sitio publicado.

## Repetir la revisión

1. Ejecutar `node scripts/serve.cjs` y abrir `http://127.0.0.1:4173`.
2. Ejecutar `node --test tests/store.test.mjs` en otra terminal.
3. Probar los flujos de la tabla, alternando vistas 390, 768 y 1440 px.
4. En [W3C Validator](https://validator.w3.org/), usar entrada directa con el contenido de `index.html`; después del despliegue, validar también la URL pública.
5. Guardar capturas nuevas si se cambia la interfaz y actualizar este registro con resultados realmente observados.
