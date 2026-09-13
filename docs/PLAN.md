# Aura Store · plan de construcción

## Auditoría inicial

Entrega individual de Desarrollo Web 2026-2. Sitio de presentación y catálogo, exclusivamente HTML5, CSS3 y JavaScript. La rúbrica suma 100: HTML 15; CSS 15; responsive 15; interacciones JS 20; formulario 10; Git 10; Vercel 5; README 10.

Obligatorio: header/nav/main/section/footer, un h1, jerarquía coherente y validación W3C; CSS externo con variables, Flexbox y Grid; tres tamaños; interacciones de DOM, validación y eventos; formulario con errores junto al campo; 6+ commits descriptivos distribuidos en el tiempo; GitHub público; Vercel conectado a GitHub; URL en README y descripción; capturas y decisiones personales.

Penalizaciones: framework −20; un commit gigante −15; README genérico −10; relleno/imágenes rotas/enlaces vacíos −10; repositorio privado: 0 hasta corregir. Tema y contenido idénticos a un compañero pueden revisarse como copia.

Bonificaciones previstas: tema persistente +4, transiciones +3, accesibilidad +3 (máximo +10 y total máximo 100). Dominio propio y envío real del formulario no se implementan: no son necesarios para la experiencia de esta entrega.

**Límites reales:** los commits documentarán esta sesión sin cambiar fechas. No se garantiza el criterio de distribución en días. El estudiante debe continuar con mejoras propias en fechas reales. La fecha de la consigna, 3 de septiembre de 2026, precede al inicio del trabajo, 13 de septiembre de 2026. Confirmar nueva fecha con el docente. GitHub, Vercel, originalidad respecto de compañeros y autoría personal del README requieren revisión del estudiante.

## Decisión de producto

**Aura Store — sneakers con identidad.** Una selección pequeña de siluetas icónicas para personas en Colombia que buscan su próximo par sin navegar un catálogo interminable. Personalidad urbana, editorial y directa. Precios expresados en COP; precios, inventario y pedidos son datos ficticios de demostración, no una oferta comercial. No hay afiliación con las marcas.

Navegación: inicio, catálogo, filosofía de selección y asesoría/pedido. Catálogo de seis modelos con marca, categoría, color, descripción, tallas e inventario por talla. Filtros combinables, búsqueda y ordenamiento. Bolsa con selección obligatoria de talla, cantidades, subtotal y persistencia. Formulario de solicitud coherente con el inventario; genera una confirmación local y nunca afirma enviar correos o cobrar dinero.

Diseño: blanco cálido, tinta negra y verde ácido; titulares grandes, fotografía de producto, márgenes amplios, tarjetas limpias. Grid para catálogo y secciones; Flexbox para navegación, filtros y acciones. Móvil primero, cortes para tablet y escritorio, tema oscuro, foco visible, mensajes accesibles y movimiento reducido.

## Modelo del dominio

- Marca (`id`, `name`) 1:N Producto.
- Categoría (`id`, `name`, `description`) 1:N Producto.
- Producto (`id`, `name`, `brandId`, `categoryId`, `description`, `color`, `price`, `image`, `alt`, `sizes`, `tag`). `sizes` relaciona talla EU e inventario local.
- Cliente (`id`, `name`, `email`, `city`) 1:N Pedido. Solo se crea como concepto en la solicitud en memoria; no se guardan datos personales en localStorage.
- Pedido (`id`, `customerId`, `items`, `status`, `createdAt`) 1:N Detalle (`productId`, `size`, `quantity`, `unitPrice`). La bolsa es un borrador; solicitar asesoría no equivale a comprar.

Futura API: GET /api/brands, /api/categories, /api/products?categoryId=&brandId=&search=; GET /api/products/:id; POST /api/customers; POST /api/orders; GET /api/orders/:id. Autenticación, validación de stock/precios en servidor, pagos y tratamiento de datos se resolverán en la Entrega 2. La capa de datos se separa de renderizado y reglas para reemplazar arreglos sin reconstruir la vista. Nunca confiar en precios ni stock enviados por el navegador.

## Arquitectura

`index.html`: estructura y formularios. `css/styles.css`: tokens, diseño, estados y responsive. `js/data.js`: entidades y catálogo. `js/store.js`: reglas puras de filtros, bolsa y validación. `js/app.js`: DOM y eventos. `assets/images/`: imágenes locales y favicon. `docs/`: plan, explicación, publicación, auditoría y capturas. `tests/`: comprobaciones de las reglas de negocio. `scripts/serve.cjs`: servidor estático local sin dependencias.

## Historial previsto (antes de escribir la aplicación)

Cada etapa termina con revisión y un commit real. No ejecutar todos estos comandos por adelantado ni reconstruir artificialmente el historial. `git init -b main` ya inicializa el repositorio. La identidad existente de Git se conserva. No se incluyen archivos de etapas futuras.

### 1. Registrar alcance y arquitectura
Objetivo y funcionalidad: traducir la rúbrica a verificaciones y fijar el dominio.
Crear: `.gitignore`, `docs/PLAN.md`. Modificar: ninguno.
Probar: revisar pesos, restricciones, relaciones y exclusiones de Git.
Commit exacto: esos dos archivos; no incluir aún HTML, CSS ni JS.
`git add .gitignore docs/PLAN.md`
`git commit -m "documenta alcance, dominio y etapas de Aura Store"`

### 2. Construir la estructura semántica
Objetivo: navegación, secciones, catálogo y formulario etiquetado.
Crear: `index.html`. Modificar: ninguno.
Probar: un h1, anclas con destino y orden de lectura.
Commit exacto: HTML inicial; no incluir estilos ni interacciones todavía.
`git add index.html`
`git commit -m "estructura las secciones semánticas de Aura Store"`

### 3. Diseñar la interfaz responsive
Objetivo: identidad visual, Flexbox y catálogo Grid adaptable.
Crear: `css/styles.css`. Modificar: `index.html` si lo exige el diseño.
Probar: estilos de móvil, tablet y escritorio; foco y espacios.
Commit exacto: CSS externo y ajustes de marcado; no datos ni lógica.
`git add css/styles.css index.html`
`git commit -m "diseña la identidad editorial y los layouts responsive"`

### 4. Incorporar catálogo y fotografías
Objetivo: seis productos relacionados por IDs y tarjetas dinámicas.
Crear: `js/data.js`, `js/app.js`, `assets/images/*`, `docs/IMAGENES.md`, `scripts/serve.cjs`.
Modificar: `index.html` para conectar módulos y recursos.
Probar: integridad de relaciones, imágenes locales y tarjetas.
Commit exacto: datos, render y recursos; sin filtros ni bolsa funcional.
`git add js/data.js js/app.js assets/images docs/IMAGENES.md scripts/serve.cjs index.html`
`git commit -m "genera el catálogo desde entidades y fotografías locales"`

### 5. Añadir exploración del catálogo
Objetivo: búsqueda, categoría, marca, orden y menú móvil.
Crear: `js/store.js`. Modificar: `js/app.js`, HTML/CSS si corresponde.
Probar: filtros combinados, sin resultados, limpiar y menú con Escape.
Commit exacto: exploración y navegación; no bolsa ni validación de pedido.
`git add js/store.js js/app.js index.html css/styles.css`
`git commit -m "añade filtros combinados y navegación móvil accesible"`

### 6. Implementar bolsa por talla
Objetivo: detalle, talla, cantidades, stock, subtotal y persistencia.
Crear: ninguno. Modificar: JS y estilos de diálogos.
Probar: no añadir sin talla, respetar stock, eliminar y recargar.
Commit exacto: bolsa y detalle; sin envío ni validación del formulario.
`git add js/store.js js/app.js index.html css/styles.css`
`git commit -m "implementa selección de talla y bolsa con control de stock"`

### 7. Validar solicitudes
Objetivo: validación personalizada de campos y reglas del dominio.
Crear: ninguno. Modificar: JS, formulario y estilos de mensajes.
Probar: campos vacíos, email, mínimo de caracteres, talla, stock y confirmación local.
Commit exacto: formulario funcional; no servicios externos ni pagos.
`git add js/store.js js/app.js index.html css/styles.css`
`git commit -m "valida solicitudes de sneakers con errores por campo"`

### 8. Completar tema y accesibilidad
Objetivo: tema oscuro persistente, estados de foco y movimiento reducido.
Crear: ninguno. Modificar: HTML/CSS/JS.
Probar: recarga del tema, teclado, diálogos y preferencia de movimiento.
Commit exacto: estas mejoras; no afirmar todavía verificaciones no ejecutadas.
`git add index.html css/styles.css js/app.js`
`git commit -m "añade tema persistente y refina la accesibilidad"`

### 9. Verificar reglas e interfaz
Objetivo: pruebas reproducibles, capturas reales y correcciones justificadas.
Crear: `tests/store.test.mjs`, capturas y resultados en `docs/`.
Modificar: únicamente archivos con fallos detectados.
Probar: lógica, HTML, escritorio/tablet/móvil y flujos completos.
Commit exacto: pruebas, evidencia y correcciones; no resultados inventados.
`git add tests docs/capturas docs/PRUEBAS.md index.html css js`
`git commit -m "verifica reglas de negocio y experiencia en tres tamaños"`

### 10. Preparar estudio y publicación
Objetivo: explicar decisiones, entregar base de README y guía GitHub/Vercel.
Crear: `README.md`, `docs/GUIA-TECNICA.md`, `docs/PUBLICACION.md`.
Modificar: ninguno salvo enlaces internos.
Probar: rutas, comandos y distinguir acciones reales de pendientes.
Commit exacto: documentación; no inventar URLs ni experiencias personales.
`git add README.md docs/GUIA-TECNICA.md docs/PUBLICACION.md`
`git commit -m "documenta decisiones y prepara la publicación académica"`

### 11. Auditar la entrega
Objetivo: matriz final, puntuación razonada y acciones del estudiante.
Crear: `docs/AUDITORIA.md`. Modificar: documentación si hay hallazgos.
Probar: comparar punto por punto contra la rúbrica y revisar Git limpio.
Commit exacto: auditoría honesta y evidencias finales; no publicar cuentas.
`git add docs/AUDITORIA.md docs/PRUEBAS.md`
`git commit -m "audita Aura Store contra la rúbrica y registra pendientes"`
