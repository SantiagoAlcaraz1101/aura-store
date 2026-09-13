# Publicar Aura Store en GitHub y Vercel

**ACCIÓN MANUAL DEL ESTUDIANTE.** El código y los commits existen localmente. No se creó un repositorio remoto, no se hizo push y no se desplegó en Vercel. No hay URLs públicas inventadas. Usa tus cuentas y conserva el historial existente.

## 1. Revisar Git local

Abre PowerShell en la carpeta del proyecto:

```powershell
Set-Location -LiteralPath 'C:\Users\user\OneDrive\Escritorio\Tienda_en_linea'
git status
git log --oneline --reverse
git log --format="%h %ad %s" --date=iso-strict
git remote -v
```

`git init -b main` ya se ejecutó al inicio. Solo se usaría ese comando en una carpeta nueva que aún no tenga `.git`. No reinicialices el trabajo para fabricar otro historial. `.gitignore` ya excluye `node_modules`, `.vercel`, archivos `.env`, logs y archivos del sistema. Revisa `git status --ignored --short` si quieres comprobarlo.

La identidad existente de Git se respetó. Consulta `git config user.name` y `git config user.email`; si necesitas corregirla para tus próximos commits, usa `git config user.name "Tu nombre"` y `git config user.email "Tu correo de GitHub"` dentro del repositorio. No cambies retrospectivamente fechas ni te atribuyas desarrollo manual que hizo la IA.

## 2. Estudiar los commits progresivos

El plan con objetivo, archivos, prueba, contenido exacto, exclusiones, `git add` y mensaje de cada etapa está en [PLAN.md](PLAN.md). Los commits ya se hicieron durante la implementación; no vuelvas a ejecutarlos para crear duplicados.

Usa `git show --stat HASH` para ver el alcance y `git show HASH -- index.html` para estudiar un cambio, sustituyendo HASH por el identificador real del historial. No hace falta cambiar de rama ni borrar archivos para aprender de las etapas.

Después de estudiar y hacer cambios propios reales:

```bash
git diff
node --test tests/store.test.mjs
git add README.md
git commit -m "explica con palabras propias las decisiones de Aura Store"
```

Añade únicamente los archivos que de verdad modificaste. Los commits deben registrar avances reales en sus fechas reales. El trabajo de esta sesión ocurrió en un solo día; la rúbrica exige distribución temporal y ese punto sigue siendo un riesgo, aunque haya muchos commits descriptivos.

## 3. Crear y conectar el repositorio público

En GitHub, inicia sesión y crea un repositorio llamado `aura-store`. Elige **Public** y déjalo vacío: sin README, licencia o gitignore nuevos, porque ya existen archivos e historial local. Copia la URL HTTPS que GitHub muestre. Luego, reemplazando `TU_USUARIO`:

```bash
git remote add origin https://github.com/TU_USUARIO/aura-store.git
git remote -v
git push -u origin main
```

Si `origin` ya existe, revisa su URL antes de cambiar nada. Para corregir una URL que tú configuraste mal, usa `git remote set-url origin URL_CORRECTA`. Autentícate con el flujo de GitHub/Git Credential Manager; no escribas tokens dentro de archivos ni los pegues en el chat. GitHub documenta este flujo para [publicar un repositorio local existente](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

Comprueba desde una ventana sin sesión que el repositorio carga, permite leer el código y muestra la etiqueta **Public**. Revisa la pestaña de commits y que `main` contenga `index.html`, carpetas y README. No basta con que tú puedas verlo mientras estás autenticado.

## 4. Conectar Vercel al repositorio

En tu cuenta de Vercel, crea un proyecto mediante la importación del repositorio GitHub `aura-store`. Autoriza acceso al repositorio que vas a desplegar y revisa:

| Opción | Valor para Aura Store |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Raíz del repositorio (`./`) |
| Build Command | Vacío; activa override si hace falta dejarlo vacío |
| Output Directory | `.` (raíz con `index.html`) |
| Install Command | Vacío; el sitio no instala dependencias |
| Variables de entorno | Ninguna |
| Production Branch | `main` |

El proyecto es HTML/CSS/JS estático y puede servirse sin compilación. La [documentación de configuración de Vercel](https://vercel.com/docs/builds/configure-a-build) explica el preset Other y los proyectos sin build. No uses el servidor local como comando de build.

Pulsa Deploy, espera el estado **Ready** y abre la URL asignada. Repite catálogo, filtros, detalle, bolsa, formulario y tema, y revisa móvil/tablet/escritorio. La URL debe cargar sin pedir entrar a tu cuenta de Vercel. Usa la URL de producción para la entrega.

## 5. Comprobar redeploy automático

Una vez publicado, reemplaza en el README los campos de GitHub y Vercel por sus URLs reales. Ese cambio sirve también para verificar la integración:

```bash
git add README.md
git commit -m "añade enlaces públicos de GitHub y Vercel"
git push origin main
```

En Deployments de Vercel, confirma que apareció un despliegue nuevo, que corresponde al hash recién enviado y que terminó en Ready. Cuando se importa desde Git, los cambios del repositorio pueden generar despliegues automáticamente; consulta el [flujo oficial de despliegues](https://vercel.com/docs/deployments/overview). Si no aparece, revisa la conexión Git y la rama de producción. No declares verificado el redeploy solo porque el primer deployment funcionó.

## 6. Añadir la URL a GitHub y entregar

En la sección About del repositorio (icono de edición), coloca la URL de Vercel en **Website** y también en la descripción, como pide la consigna. Ejemplo, sustituyendo la URL real: «Aura Store · Sneakers · HTML/CSS/JS · Sitio: URL_REAL». Guarda y comprueba sin sesión.

**ACCIÓN MANUAL DEL ESTUDIANTE — checklist final:**

- [ ] Confirmar con el docente la fecha válida: la consigna indica 3 de septiembre de 2026 y este trabajo comenzó el 13 de septiembre.
- [ ] Confirmar que el dominio y contenido difieren de los de otros estudiantes.
- [ ] Leer, probar y explicar el código; completar el README con palabras propias.
- [ ] Revisar créditos y uso de las imágenes; usar fotos propias si corresponde.
- [ ] Comprobar GitHub público, historial visible y README sin campos pendientes.
- [ ] Comprobar Vercel accesible sin sesión, integración Git y nuevo despliegue por push.
- [ ] Verificar que las URLs estén en README y About/descripción.
- [ ] Validar el HTML publicado y actualizar capturas si cambió el diseño.
- [ ] Enviar **ambas URLs** por UVirtual/Moodle.
- [ ] Enviar las mismas URLs por correo al docente. No se ha enviado ningún mensaje desde esta sesión.

Plantilla para que tú envíes el correo: «Entrega 1 — Aura Store. Estudiante: [tu nombre]. Repositorio público: [URL real]. Sitio Vercel: [URL real]». No es necesario adjuntar código si el docente lo revisará desde el repositorio, salvo que te lo solicite.
