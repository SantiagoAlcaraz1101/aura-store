# Aura Store — sneakers con identidad

**Autor:** Santiago Alcaraz.  
**Curso:** Desarrollo Web · 2026-2  
**Repositorio GitHub público:** [text](https://github.com/SantiagoAlcaraz1101/aura-store.git)
**Sitio Vercel:** [text](https://aura-store-azure.vercel.app/)

## El proyecto

Me incliné por Aura Store por su similitud a proyectos que he realizado anteriormente en otras materias de la universidad, por lo que el desarrollo de esta tienda online enfocada en la venta de sneakers puede ser mas ameno.

En resumidas cuentas Aura Store es una tienda académica de sneakers para personas en Colombia que quieren comparar una selección de modelos por marca, estilo y talla. Reúne seis pares en cinco marcas y tres categorías, con precios de demostración en COP. Busca hacer la elección más clara mostrando color, referencia, disponibilidad por talla y una descripción de estilo.

Es una simulación: no hay ventas, reservas, correos enviados ni cobros. Los precios y existencias son ficticios. Las fotografías son referencias de terceros, puede ver los autores de las imagenes en: [créditos](docs/IMAGENES.md).

## Qué puede hacer el visitante

- Explorar el catálogo de sneakers disponible
- Combinar categoría, marca y búsqueda; ordenar por precio o nombre.
- Consultar el detalle, elegir una talla disponible y añadirla a la bolsa.
- Modificar cantidades respetando stock; recuperar bolsa y tema al recargar.
- Preparar una solicitud con errores específicos junto a cada campo.
- Usar menú móvil, tema oscuro y navegación con teclado.

## Tecnologías y ejecución

HTML5, CSS3 y JavaScript ES Modules. Sin React, Bootstrap, Tailwind, jQuery ni otras dependencias de interfaz. Node se usa únicamente para desarrollo local y pruebas, no como backend de la tienda.

Con Node.js 22 o superior (verificado con 24.15.0):

```bash
node scripts/serve.cjs
```

Este comando abre [Aura Store local](http://127.0.0.1:4173). Mantén esa terminal abierta. No abras `index.html` con doble clic: los módulos requieren un servidor HTTP. Alternativa: una extensión de servidor estático como Live Server. No hay instalación de paquetes ni paso de compilación para el sitio.

## Estructura

```text
index.html
css/styles.css
js/
  data.js                 # productos, marcas y categorías
  store.js                # reglas puras de negocio
  app.js                  # DOM, eventos y persistencia
assets/images/            # fotografías locales y favicon
scripts/serve.cjs         # servidor local sin dependencias
tests/store.test.mjs      # pruebas con herramientas de Node
docs/
  IMAGENES.md              # procedencia de imágenes
  validacion-html.json     # respuesta de W3C
  capturas/               # capturas reales
.gitignore
```

## Modelo del dominio

Marcas y categorías tienen muchos productos mediante `brandId` y `categoryId`. Cada producto tiene tallas con stock. Un cliente puede tener varios pedidos; los detalles relacionan cada pedido con un producto, talla y cantidad. En esta entrega, los productos son fixtures locales y la solicitud solo construye un ejemplo de cliente/pedido en memoria. La bolsa se conserva sin datos personales.

**PERSONALIZA:** explica la diferencia entre «marca» y «categoría» usando Dunk y Samba. Describe qué parte cambiarías para consumir una API REST.

## Decisiones

### Flexbox y Grid

Flexbox alinea navegación, filtros y acciones. Grid distribuye hero, catálogo y formulario. El catálogo cambia entre una, dos y tres columnas según el ancho. Las variables CSS centralizan la paleta y permiten alternar el tema.

### JavaScript y validación

los eventos modifican filtros, renderizan tarjetas, abren el menú y el detalle, actualizan la bolsa y validan solicitudes. El formulario exige campos completos, email válido, longitudes correctas y talla con stock para el sneaker elegido. Muestra mensajes junto al campo y no prepara la solicitud si hay errores.

### Responsive y accesibilidad

Base factual: la interfaz se verificó a 320, 390, 768 y 1440 px, sin overflow horizontal. Incluye enlaces semánticos, etiquetas, alt descriptivos, focos visibles, estados ARIA, diálogos nativos y `prefers-reduced-motion`.

### Uso de inteligencia artificial

Me apoyé en IA durante la primera etapa de desarrollo de **Aura Store**, especialmente para las pruebas y para mejorar el diseño visual de la página.

## Capturas reales

### Escritorio

![Aura Store en escritorio](docs/capturas/escritorio-vista.png)

### Móvil

![Aura Store en móvil](docs/capturas/movil.png)

También hay [captura de la página completa](docs/capturas/escritorio.png), [catálogo móvil](docs/capturas/catalogo-movil.png), [tablet](docs/capturas/tablet.png) y [modo oscuro](docs/capturas/oscuro.png).
