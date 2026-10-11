# Benny’s Motors · Calculadora de taller

Calculadora de servicios de Benny’s Motors con cuentas de administrador y empleados, órdenes compartidas en Supabase y los 18 precios originales del servidor. HTML, CSS y JavaScript estáticos; lista para GitHub Pages.

## Usar

Ejecuta `npm start` y abre http://127.0.0.1:8092. No requiere instalar dependencias para funcionar: fuentes, ilustración y SDK oficial de Supabase están incluidos. La conexión está configurada en `dist/config.js` con la URL y clave **publicable** del proyecto; no se utiliza ninguna clave secreta de administración.

## Publicar en GitHub Pages

1. En [ElCodexVEVO/bennysmotor](https://github.com/ElCodexVEVO/bennysmotor), abre **Settings → Pages**.
2. En **Source**, selecciona **Deploy from a branch**; rama **main**, carpeta **/ (root)** y **Save**.
3. GitHub mostrará el enlace cuando termine. La dirección esperada es https://elcodexvevo.github.io/bennysmotor/ . El `index.html` raíz abre la aplicación de `dist/` y conserva los parámetros de confirmación de correo.
4. En Supabase → **Authentication → URL Configuration**, establece **Site URL** en `https://elcodexvevo.github.io/bennysmotor/dist/` y añade esa misma dirección a **Redirect URLs**. Si usas un dominio propio, usa su URL correspondiente.

No necesita servidor, variables de entorno de GitHub ni proceso de compilación para Pages. Cada navegador mantiene su propio borrador; las órdenes registradas se sincronizan con el taller de Supabase.

## Activar el taller

1. Ejecuta `supabase/setup.sql` en el SQL Editor del proyecto de Supabase. Guarda el `codigo_inicial_admin` que devuelve; no lo subas al repositorio ni lo compartas con empleados. **Si ya lo ejecutaste, no necesitas repetirlo.**
2. En la aplicación pulsa **Acceder → Crear cuenta**, indica tu nombre, correo y contraseña. Confirma el correo si Supabase lo solicita y vuelve a iniciar sesión.
3. Introduce el código inicial para activar tu administrador. El código se usa una vez.
4. Cada empleado crea su propia cuenta. Desde **Equipo**, el administrador activa su acceso y asigna su comisión.

El administrador ve todas las órdenes, administra empleados y edita tarifas. Los empleados ven sus propias órdenes y tienen una comisión asignada. Una cuenta pendiente o inactiva no puede consultar ni registrar servicios.

## Funciones

- 18 servicios del tarifario enviado por el usuario, en euros: 7 de taller, 2 motores, 3 tracciones, 3 neumáticos y 3 extras.
- Búsqueda, categorías, cantidades y selecciones rápidas.
- Motor, tracción y neumáticos admiten una opción por vehículo; cambiar de opción reemplaza la anterior.
- Solo nombre del cliente; descuento porcentual y comisión del mecánico.
- Clientes frecuentes: lista automática de nombres con visitas, última visita e importe acumulado, ordenada por frecuencia. Permite buscar y reutilizar un cliente en la orden. Solo suma órdenes cobradas, agrupa variantes de mayúsculas, tildes y espacios. El administrador ve los clientes del taller y cada empleado los de sus órdenes. No requiere ejecutar SQL adicional.
- Costo de fábrica, total de venta, comisión y ganancia del taller visibles en cada orden.
- La comisión se calcula sobre la ganancia positiva después del descuento. El administrador la asigna a cada empleado y puede cambiarla en sus propias órdenes.
- Registro de servicios cobrados con pago y notas, ticket para FiveM, historial, búsqueda, filtros por período y anulación con conservación del registro.
- Resumen de ingresos, costos, descuentos, comisiones, ganancia y servicios frecuentes, basado en órdenes activas.
- Tarifas compartidas editables por el administrador y restauración de los precios originales. Las órdenes registradas conservan sus precios. Si cambia una tarifa mientras se prepara un servicio, se actualiza la cotización y se solicita revisar el nuevo total antes de registrar.
- Exportación CSV de las órdenes filtradas, con protección frente a fórmulas en textos.
- Respaldo JSON desde Configuración e importación validada del antiguo guardado local al cotizar sin sesión. Los respaldos no incluyen contraseñas ni sesiones.
- Interfaz para escritorio, tableta y móvil, con respeto al movimiento reducido.

## Tarifario original

| Servicio | Costo de fábrica | Precio de venta |
| --- | ---: | ---: |
| Rendimiento | 7.000 € | 10.000 € |
| Juego de ruedas | 7.000 € | 10.000 € |
| Humo de neumáticos | 2.500 € | 5.000 € |
| Cosméticos | 2.000 € | 3.000 € |
| Repintar | 500 € | 1.500 € |
| Limpieza | 250 € | 500 € |
| Reparación | 500 € | 1.000 € |
| Motor V12 | 300.000 € | 500.000 € |
| Motor V8 | 40.000 € | 50.000 € |
| Tracción AWD | 8.000 € | 12.500 € |
| Tracción RWD | 7.000 € | 11.500 € |
| Tracción FDW | 8.500 € | 10.500 € |
| Slick | 4.000 € | 6.000 € |
| Semi-Slick | 3.500 € | 6.000 € |
| Offroad | 4.500 € | 6.500 € |
| Frenos cerámicos | 8.000 € | 20.000 € |
| Turbo charger | 25.000 € | 35.000 € |
| Kit de extras | 4.000 € | 5.000 € |

Se conserva `FDW` como aparece en la imagen del servidor. Las unidades azules de esa imagen no son precios: son una configuración de referencia. La selección V8 + AWD + Slick + frenos cerámicos tiene costo de 60.000 €, venta de 88.500 € y ganancia base de 28.500 €.

## Guardado

Las órdenes, perfiles y tarifas se guardan en Supabase. Las tablas tienen RLS: cada empleado consulta sus registros; el administrador consulta los del taller. Las escrituras se realizan mediante funciones que comprueban el rol, las tarifas y los cálculos en la base de datos. El registro utiliza un identificador único para que un reintento de la misma operación no duplique la orden.

El borrador y una caché por cuenta se conservan en `localStorage`; al cerrar sesión se limpia la caché de esa cuenta. La sesión de Supabase se mantiene en este navegador hasta cerrar sesión. En equipos compartidos, cada empleado debe cerrar su sesión al terminar. La sincronización se realiza al acceder, al volver a la pestaña, con Actualizar y cada 30 segundos mientras está visible.

El botón Registrar no verifica pagos de FiveM: el mecánico comprueba el pago dentro del juego. Los registros del antiguo modo local pueden consultarse sin sesión o exportarse como respaldo; no se importan automáticamente al taller compartido.

## Desarrollo y comprobación

`dist/catalog.js` contiene las tarifas originales, `dist/core.js` los cálculos y ticket, `dist/cloud.js` la conexión con Supabase y `dist/app.js` la interfaz. Tras editar JavaScript ejecuta `npm run build` para regenerar `dist/bundle.js`. HTML y CSS se editan directamente.

Para las pruebas SQL instala la dependencia de desarrollo con `npm ci --prefix tests` y ejecuta `npm test`. Usan PostgreSQL local mediante PGlite, sin tocar el proyecto real: instalación, activación por código, RLS, roles, cantidades, tarifas, cálculos, reintentos y anulación. `npm run test:core` comprueba los cálculos sin dependencias.

`npm run test:browser` usa el SDK real con respuestas HTTP simuladas, sin crear usuarios ni ventas en producción. Comprueba acceso, equipo, cobro, reintentos, aislamiento de cuentas y tamaños de 360 a 1920 píxeles. En otro equipo establece `PLAYWRIGHT_PATH` al módulo de Playwright y `EDGE_PATH` al ejecutable de un navegador Chromium. Los resultados están en `tests/browser-results.json`.

## Recursos visuales

Ilustración del taller generada con la herramienta integrada ImageGen y optimizada en `dist/assets/garage.webp`. Prompt completo en `docs/garage-prompt.txt`. Tipografías locales Barlow Condensed, DM Sans y Yellowtail, distribuidas con sus licencias en `dist/assets/fonts`.
