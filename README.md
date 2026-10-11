# Benny’s Motors · Gestión del taller

Sistema interno de Benny’s Motors para registrar ventas, consultar clientes frecuentes y controlar comisiones, gastos y actividad. Acceso por usuario y contraseña, con administrador y empleados mediante Supabase. No solicita correo electrónico. Interfaz de escritorio y móvil con tema de Halloween, pantalla de carga y panel de inicio. HTML, CSS y JavaScript estáticos, preparados para GitHub Pages.

## Usar

Ejecuta `npm start` y abre http://127.0.0.1:8092. No requiere instalar dependencias para funcionar: fuentes y SDK oficial de Supabase están incluidos. La conexión está configurada en `dist/config.js` con la URL y clave **publicable** del proyecto; no se utiliza ninguna clave secreta de administración.

## Publicar en GitHub Pages

1. En [ElCodexVEVO/bennysmotor](https://github.com/ElCodexVEVO/bennysmotor), abre **Settings → Pages**.
2. En **Source**, selecciona **Deploy from a branch**; rama **main**, carpeta **/ (root)** y **Save**.
3. GitHub mostrará el enlace cuando termine. La dirección esperada es https://elcodexvevo.github.io/bennysmotor/ . El `index.html` raíz abre la aplicación de `dist/` y conserva los parámetros de confirmación de correo.
4. En Supabase → **Authentication → URL Configuration**, establece **Site URL** en `https://elcodexvevo.github.io/bennysmotor/dist/` y añade esa misma dirección a **Redirect URLs**. Si usas un dominio propio, usa su URL correspondiente.

No necesita servidor, variables de entorno de GitHub ni proceso de compilación para Pages. Cada navegador mantiene su propio borrador; las órdenes registradas se sincronizan con el taller de Supabase.

## Activar el taller

1. Ejecuta `supabase/setup.sql` en el SQL Editor del proyecto de Supabase. Guarda el `codigo_inicial_admin` que devuelve; no lo subas al repositorio ni lo compartas con empleados. **Si ya lo ejecutaste, no necesitas repetirlo.**
2. Ejecuta `supabase/upgrade-profesional.sql` para habilitar gastos, auditoría y motivos de anulación. Es una actualización aditiva y repetible: conserva usuarios, tarifas y ventas. Si ya está instalada, no necesitas repetirla.
3. Activa el acceso por usuario siguiendo [supabase/ACCESO-POR-USUARIO.md](supabase/ACCESO-POR-USUARIO.md): ejecuta `upgrade-usuarios.sql` y despliega la Edge Function `bennys-staff`.
4. En la pantalla de acceso pulsa **Solicitar acceso** e indica nombre, usuario y contraseña. No se pide correo ni confirmación por correo.
5. Introduce el código inicial para activar tu administrador. El código se usa una vez.
6. Puedes crear mecánicos activos desde **Equipo → Crear mecánico**, o aprobar allí las solicitudes del personal y asignar su comisión.

El administrador ve todas las órdenes, administra empleados y edita tarifas. Los empleados ven sus propias órdenes y tienen una comisión asignada. Una cuenta pendiente o inactiva no puede consultar ni registrar servicios.

## Funciones

- Inicio con ventas del período, ticket promedio, comisiones, margen del taller, evolución de ventas, métodos de pago y rendimiento por mecánico. Los gráficos y cifras utilizan registros reales.
- Pantalla de carga durante la comprobación de sesión y lectura inicial de registros; sincronización posterior en segundo plano.
- Acceso obligatorio por usuario y contraseña. Administración crea mecánicos activos o aprueba solicitudes. Las cuentas anteriores mantienen su contraseña; el SQL devuelve su usuario asignado.
- Tema Halloween en carbón y naranja, con murciélagos y telarañas discretos en el acceso. Transiciones de paneles, gráficos, modales y botones; respeta la preferencia de movimiento reducido.
- 18 servicios del tarifario enviado por el usuario, en euros: 7 de taller, 2 motores, 3 tracciones, 3 neumáticos y 3 extras.
- Búsqueda, categorías, cantidades y selecciones rápidas.
- Motor, tracción y neumáticos admiten una opción por vehículo; cambiar de opción reemplaza la anterior.
- Solo nombre del cliente; descuento porcentual y comisión del mecánico.
- Clientes frecuentes: lista automática de nombres con visitas, última visita e importe acumulado, ordenada por frecuencia. Permite buscar y reutilizar un cliente en la orden. Incluye historial de servicios por cliente. Solo suma órdenes cobradas, agrupa variantes de mayúsculas, tildes y espacios. El administrador ve los clientes del taller y cada empleado los de sus órdenes.
- Costo de fábrica, total de venta, comisión y ganancia del taller visibles en cada orden.
- La comisión se calcula sobre la ganancia positiva después del descuento. El administrador la asigna a cada empleado y puede cambiarla en sus propias órdenes.
- Registro de servicios cobrados con pago y notas, ticket para FiveM, historial, búsqueda, filtros por período, estado, pago y mecánico; anulación con motivo y conservación del registro.
- Informe de comisiones por mecánico y período, con exportación CSV. Muestra comisiones generadas, sin registrar pagos de nómina.
- Finanzas para administración: gastos por categoría, anulación sin borrar registros y resultado calculado como ventas menos piezas, comisiones y gastos. Es un resultado operativo estimado, no el saldo bancario del juego.
- Actividad para administración: ventas, anulaciones con motivo, gastos, cambios de empleados y tarifas, con autor, fecha y búsqueda. La auditoría empieza al instalar la actualización; no reconstruye cambios anteriores.
- Tarifas compartidas editables por el administrador y restauración de los precios originales. Las órdenes registradas conservan sus precios. Si cambia una tarifa mientras se prepara un servicio, se actualiza la cotización y se solicita revisar el nuevo total antes de registrar.
- Exportación CSV de las órdenes filtradas, con protección frente a fórmulas en textos.
- Respaldo JSON de ventas, tarifas y borrador accesibles a la cuenta desde Configuración. No incluye contraseñas ni sesiones.
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

Las ventas, perfiles, tarifas, gastos y auditoría se guardan en Supabase. Gastos y auditoría son visibles solo para administradores. Las tablas tienen RLS: cada empleado consulta sus registros; el administrador consulta los del taller. Las escrituras se realizan mediante funciones que comprueban el rol, las tarifas y los cálculos en la base de datos. El registro utiliza un identificador único para que un reintento de la misma operación no duplique la orden.

El borrador y una caché por cuenta se conservan en `localStorage`; al cerrar sesión se limpia la caché de esa cuenta. La sesión de Supabase se mantiene en este navegador hasta cerrar sesión. En equipos compartidos, cada empleado debe cerrar su sesión al terminar. La sincronización se realiza al acceder, al volver a la pestaña, con Actualizar y cada 30 segundos mientras está visible.

Confirmar venta no verifica pagos de FiveM: el mecánico comprueba el pago dentro del juego. Los registros del antiguo modo local no se importan automáticamente al taller compartido. No hay acceso público al panel.

## Desarrollo y comprobación

`dist/catalog.js` contiene las tarifas originales, `dist/core.js` los cálculos y ticket, `dist/operations.js` los informes y períodos, `dist/cloud.js` la conexión con Supabase, `dist/management.js` los módulos de gestión y `dist/app.js` el punto de venta y acceso. `dist/halloween.css` contiene el tema de temporada y las animaciones. Tras editar JavaScript ejecuta `npm run build` para regenerar `dist/bundle.js`. HTML y CSS se editan directamente.

Para las pruebas SQL instala la dependencia de desarrollo con `npm ci --prefix tests` y ejecuta `npm test`. Usan PostgreSQL local mediante PGlite, sin tocar el proyecto real: instalación, activación por código, RLS, roles, cantidades, tarifas, cálculos, reintentos, anulación, gastos y auditoría; también comprueban que repetir la actualización conserva datos. `npm run test:core` comprueba los cálculos sin dependencias.

`tests/staff.test.mjs` comprueba la función de acceso: login, creación solo por administradores, solicitudes pendientes, límites y limpieza ante fallos.

`npm run test:browser` usa el SDK real con respuestas HTTP simuladas, sin crear usuarios ni ventas en producción. Comprueba acceso, equipo, cobro, reintentos, aislamiento de cuentas, informes, filtros, gastos, auditoría, carga real, creación de mecánicos, solicitudes por usuario, movimiento reducido y tamaños de 360 a 1920 píxeles. En otro equipo establece `PLAYWRIGHT_PATH` al módulo de Playwright y `EDGE_PATH` al ejecutable de un navegador Chromium. Los resultados están en `tests/browser-results.json`.

## Recursos visuales

El tema actual utiliza gráficos vectoriales y CSS. Se conserva la ilustración de la versión anterior en `dist/assets/garage.webp` y su prompt en `docs/garage-prompt.txt`. Tipografías locales Barlow Condensed, DM Sans y Yellowtail, distribuidas con sus licencias en `dist/assets/fonts`.
