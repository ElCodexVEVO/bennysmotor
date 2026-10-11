# Procedencia de las imágenes

| Archivo | Origen |
|---|---|
| `scripts/fuentes/bennys-acceso-fachada.webp` | Original del acceso, sin recomponer. Generado con ImageGen a partir de las fotografías del taller del usuario (prompt «exterior» en `docs/PROMPTS-IMAGENES.md`). Optimizado a WebP. Es la entrada de `scripts/prepare-backgrounds.mjs`; no se publica en el sitio. |
| `dist/assets/halloween/bennys-panel-interior.webp` | Cabecera del panel. Generado con ImageGen a partir de las fotografías del taller (prompt «interior» en `docs/PROMPTS-IMAGENES.md`). Optimizado a WebP. |
| `dist/assets/halloween/bennys-acceso-panel.webp` | Fachada recompuesta para un panel **centrado** (2063×941): el tramo que queda tras el panel es una zona desenfocada del mismo mural y la puerta, el neón BENNY’S y las calabazas pasan al lado derecho. Recomposición de `bennys-acceso-fachada.webp`, sin contenido nuevo. Generado con `npm run backgrounds`. |
| `dist/assets/halloween/bennys-acceso-movil.webp` | Versión vertical (700×1515): neón y telarañas arriba, calabazas abajo, centro desenfocado tras la tarjeta. Recomposición de `bennys-acceso-fachada.webp`. Generado con `npm run backgrounds`. |
| `dist/assets/halloween/bennys-panel-fondo.webp` | `bennys-panel-interior.webp` con desenfoque suave y más oscuro (1600×900) para el fondo del panel. Generado con `npm run backgrounds`. |
| `dist/assets/logo3d/bennys-wordmark.webp`, `bennys-monogram.webp`, `dist/assets/apple-touch-icon.png` | Render de la geometría 3D de `logo3d/` (no son ilustraciones independientes). Generados con `npm run logo:assets`. |
| `dist/assets/favicon.svg` | Contorno vectorial del monograma (`logo3d/source/monogram.svg`). |
| `dist/assets/garage.webp` | Ilustración de la versión anterior (tema naranja). Ya no se utiliza; se conserva por historial. |

Los fondos del acceso y del panel son reinterpretaciones del local, no capturas del servidor. Las referencias de diseño (conceptos estáticos) y las fotografías originales viajan en el ZIP de la entrega y no se publican en el sitio. Cada imagen de `dist/assets` lleva un archivo `.json` con su origen o prompt (metadatos de procedencia).
