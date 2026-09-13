# Auditoría final · Aura Store

Fecha: 13 de septiembre de 2026. Comparación con la rúbrica exacta de Entrega 1, Desarrollo Web 2026-2. Esta evaluación es orientativa; la calificación y las bonificaciones corresponden al docente.

**Estado de entrega:** implementación local completa, publicación externa pendiente. Sin repositorio público accesible, la consigna indica que no puede calificarse y asigna 0 hasta corregir. La estimación técnica de abajo no reemplaza esa condición.

## Matriz verificable

| Requisito | Estado | Evidencia | Acción pendiente |
| --- | --- | --- | --- |
| Dominio relacionable | Cumple | Productos, marcas, categorías, clientes y pedidos en PLAN y GUIA-TECNICA | Confirmar diferencia con proyectos de compañeros |
| HTML semántico | Cumple | header, nav, main, section, article, footer en index.html y tarjetas | Ninguna local |
| HTML válido | Verificado | Nu/W3C 26.9.9, `messages: []`, validacion-html.json | Revalidar URL publicada |
| Encabezados | Cumple | Un h1; secciones h2; tarjetas/principios/formulario h3 | Ninguna local |
| CSS externo | Cumple | css/styles.css enlazado, sin style ni atributos style | Ninguna |
| Variables CSS | Cumple | `:root` y sustituciones en `[data-theme="dark"]` | Ninguna |
| Flexbox | Cumple | Navegación, filtros, acciones, fila de marcas | Poder explicar por qué |
| CSS Grid | Cumple | Hero, catálogo, secciones, campos del formulario | Poder explicar por qué |
| Responsive móvil | Verificado | Viewports 320 y 390, 1 y 2 columnas, sin overflow horizontal | Opcional: dispositivo físico |
| Responsive tablet | Verificado | 768 px, 2 columnas y adaptación del formulario | Opcional: dispositivo físico |
| Responsive escritorio | Verificado | 1440 px, 3 columnas, captura de página completa | Ninguna local |
| Catálogo dinámico | Cumple | 6 objetos en data.js y renderProducts en app.js | Ninguna |
| Filtros por categoría | Verificado | Esenciales devuelve 2; con Nike devuelve 1 | Ninguna |
| Búsqueda y orden | Cumple | Normalización de acentos, orden por precio/nombre, pruebas | Ninguna |
| Manipulación DOM | Cumple | Tarjetas, contador, estados, diálogos y errores | Ninguna |
| Eventos / addEventListener | Cumple | click, input, change, submit, focusout, keydown | Ninguna |
| Menú hamburguesa | Verificado | Apertura/cierre, Escape, navegación, aria-expanded | Ninguna |
| Formulario etiquetado | Cumple | Nombre, correo, ciudad, modelo, talla, mensaje, confirmación | Ninguna |
| Validación propia | Verificado | Requeridos, email, longitudes, consentimiento, producto y talla con stock | Ninguna |
| Errores junto al campo | Verificado | field-error, aria-describedby, aria-invalid; foco en primer error | Ninguna |
| No acepta datos inválidos | Verificado | No prepara solicitud hasta pasar validateRequest; sin alert | Ninguna |
| Bolsa por talla | Verificado | Selección, cantidades, subtotal, eliminación y límite de stock | Ninguna |
| Modo oscuro | Verificado | Toggle, variables y captura oscuro.png | Ninguna |
| localStorage | Verificado | Persistencia de tema y bolsa al recargar; recuperación probada en reglas | Ninguna |
| Accesibilidad | Implementada y comprobada parcialmente | Teclado, Escape, retorno de foco, etiquetas, alt, mensajes, contraste de paleta y reduced-motion | Recomendado: lector de pantalla; no certificación WCAG |
| Contenido específico | Cumple | Aura Store, seis modelos, colores, descripciones propias, COP y reglas de talla | Confirmar originalidad frente al grupo |
| Imágenes | Verificado con límite de derechos | Carga local de todas; alt descriptivos; IMAGENES.md | Revisar permisos de fotografías de terceros; no se afirma licencia libre |
| Frameworks prohibidos | No se usan | HTML/CSS/JS puro; sin dependencias de interfaz | Ninguna |
| .gitignore | Cumple | Excluye node_modules, .vercel, .env, sistema, logs y temporales | Ninguna |
| Cantidad de commits | Cumple | 11 etapas reales; plan registrado antes del HTML | Revisar y entender el historial |
| Distribución temporal de commits | Parcial | Trabajo de esta sesión en un solo día, sin fechas alteradas | Continuar mejoras propias en fechas reales; consultar criterio del docente |
| README | Base específica, pendiente personal | Descripción, modelo, ejecución, capturas, decisiones y transparencia sobre IA | Reescribir en palabras propias; dificultad real; autor y URLs |
| Capturas | Cumple | docs/capturas: escritorio, móvil, catálogo móvil, tablet y oscuro | Renovarlas si cambia la interfaz |
| GitHub público | Pendiente | Repositorio solo local; no hay origin ni push | Crear repositorio público y subir main |
| Vercel público | Pendiente | No se realizó despliegue | Importar GitHub, preset Other y desplegar |
| Conexión GitHub/Vercel | Pendiente | No se realizó prueba externa | Confirmar nuevo despliegue por un push real |
| URL en README | Pendiente explícito | Campo marcado, sin enlace inventado | Pegar URL real |
| URL en descripción GitHub | Pendiente | Sin repositorio remoto | Añadir a About/Website y descripción |
| Entrega por ambos canales | Pendiente | No se enviaron mensajes | Enviar ambas URLs por Moodle y correo al docente |
| Fecha de entrega | Requiere aclaración del estudiante | Consigna: 3 septiembre; desarrollo: 13 septiembre de 2026 | Confirmar fecha autorizada |

## Estimación usando exactamente los ocho criterios

Los niveles de la rúbrica son Excelente (100 %), Bueno (75 %), Aceptable (50 %) e Insuficiente (0–25 %). Para los pendientes se usa una estimación conservadora, sin regalar puntos de publicación o autoría personal.

| # | Criterio de la rúbrica | Máximo | Estimación técnica | Razón |
| --- | --- | ---: | ---: | --- |
| 1 | HTML semántico y válido | 15 | 15 | Estructura semántica y respuesta W3C sin mensajes |
| 2 | CSS: variables, Flexbox y Grid | 15 | 15 | Uso externo y justificado de los tres recursos |
| 3 | Responsive real (móvil, tablet, escritorio) | 15 | 15 | Evidencia de los tres tamaños; adaptación y ausencia de overflow |
| 4 | JavaScript: 3 interacciones (DOM, validación, eventos) | 20 | 20 | Más de tres: render, filtros, menú, bolsa, tema y validación |
| 5 | Formulario con validación propia | 10 | 10 | Requeridos, email, longitudes, regla de talla, errores locales |
| 6 | Git: historial progresivo de commits | 10 | 5 | Etapas reales y descriptivas, pero en una misma sesión/día |
| 7 | Despliegue en Vercel conectado a GitHub | 5 | 0 | Aún no publicado ni verificado |
| 8 | README con decisiones explicadas | 10 | 5 | Base específica con capturas; faltan palabras y experiencias del estudiante |
| | **Total base** | **100** | **85** | Referencia técnica condicional, no nota oficial |

Los 5 puntos de Git y README son una hipótesis de nivel Aceptable; el docente podría evaluar más bajo la distribución temporal o la falta de autoría personal. No hay garantía de esa puntuación.

## Bonificaciones obtenibles

| Bonificación exacta | Puntos | Evidencia / límite |
| --- | ---: | --- |
| Modo oscuro funcional con toggle que recuerda preferencia | +4 | Verificado al recargar |
| Animaciones o transiciones CSS bien logradas | +3 | Controles, tarjetas y avisos; sin animación excesiva |
| Dominio propio conectado a Vercel | +0 de 3 | No contratado ni conectado |
| Formulario que realmente envía | +0 de 3 | Simulación explícita, no envío real |
| Accesibilidad cuidada | +3 | Semántica, etiquetas, alt, foco, teclado y movimiento reducido; concesión del docente |
| **Total potencial** | **+10** | Máximo permitido; total final no puede superar 100 |

Si el docente reconoce esos bonos, la proyección técnica sería **85 + 10 = 95/100**, equivalente a **4,75/5,0**. **No es la nota de una entrega aún sin repositorio público.** Publicar correctamente y completar un README propio recuperaría hasta 10 puntos base: 95 base; con bonos podría llegar al tope de 100 incluso si Git permanece parcial. Solo el docente decide la aplicación de los niveles y bonos.

## Penalizaciones y puntos en riesgo

- **Framework −20:** evitado; no hay frameworks. Node para servir/pruebas y el formateador de desarrollo no son librerías de la interfaz.
- **Un único commit gigante −15:** evitado; el plan precede al código y las etapas se registraron mientras se construían. La distribución en días es un requisito aparte que no está plenamente satisfecho.
- **README genérico −10:** la base describe Aura específicamente, pero entregar texto de IA sin apropiación personal sigue siendo un riesgo académico. No se garantiza evitar descuento si se deja sin personalizar.
- **Relleno, imágenes rotas o enlaces vacíos −10:** no hay Lorem Ipsum ni enlaces `href="#"`. Las imágenes cargaron; los enlaces internos tienen destino. Los campos pendientes del README deben completarse antes de entregar.
- **Repositorio privado o inaccesible:** condición crítica de 0 hasta corregir, todavía pendiente de publicación.
- **Copia:** el tema fue elegido por el estudiante; no se puede comprobar qué hacen los compañeros desde este entorno.
- **Fecha:** no se inventó una penalización por retraso; la consigna aportada no cuantifica ese descuento. Confirmar la posibilidad de entregar después de su fecha.

## Acciones manuales antes de entregar

1. Confirmar fecha y originalidad con el docente/grupo.
2. Estudiar GUIA-TECNICA, probar la tienda y hacer las modificaciones propias que consideres necesarias.
3. Reescribir README con tu descripción, decisiones, uso real de IA, dificultad y solución personales.
4. Crear GitHub público, subir el historial existente y verificar acceso sin sesión.
5. Conectar Vercel, publicar y comprobar un redeploy automático con un push real.
6. Añadir las URLs a README y descripción; actualizar capturas si cambió el sitio.
7. Repetir validación y flujos en producción.
8. Entregar las mismas dos URLs en Moodle y por correo.

Los comandos y opciones de publicación están en [PUBLICACION.md](PUBLICACION.md); las verificaciones efectivamente realizadas, en [PRUEBAS.md](PRUEBAS.md).
