# SVB — Portafolio

Portafolio personal de **Sebastian Valecillos Blanco** (SVB). Sitios de una
página, estáticos, sin backend.

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (vía `@tailwindcss/vite`, tokens en `src/index.css`)
- **Motion** (`motion/react`) para animaciones y scroll
- **three.js** para el hero 3D (laptop y celular), cargado aparte en su propio chunk
- **Fuentes** alojadas en el propio sitio vía `@fontsource` (Anton, Inter,
  JetBrains Mono, solo subset latino), importadas en `src/main.jsx`

## Comandos

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve dist/
npm run lint      # oxlint
```

## Estructura

```
src/
  components/     secciones y primitivas de animación
  data/           copy del sitio y de los proyectos
  lib/heroScene.js  escena 3D del hero (modelos, cámara y coreografía)
  assets/projects/  capturas reales de los sitios entregados
```

`vite.config.js` usa `base: './'`, así que el build funciona desde cualquier
sub-ruta (GitHub Pages). Al publicar en un subdirectorio, las rutas de
importación de imágenes se resuelven solas.

## Añadir un proyecto al portafolio

1. Depositá la captura en `src/assets/projects/`.
2. Agregá la entrada en `src/data/projects.js`.

`url` va en `null` si el sitio todavía no está publicado: la tarjeta muestra
un estado neutro en vez de enlazar a un 404.

## Hero 3D

`src/components/HeroStory.jsx` arma el texto y `src/lib/heroScene.js` la
escena. Al cargar caen una laptop y un celular; con el scroll se abre la tapa,
la página se arma sola, pasan los cuatro proyectos y la cámara entra en la
pantalla, donde los proyectos flotan como ventanas.

Las capturas que muestran las pantallas están en `public/hero/` (por proyecto:
`-desk` y `-mob` con el contenido, `-desk-ov` y `-mob-ov` con lo que queda
fijo arriba, como el menú). Al agregar un proyecto hay que sumar sus cuatro
capturas con el mismo `id` que en `src/data/projects.js`. Qué proyectos pasan
por el hero, y en qué orden, se elige en `HERO_IDS` en ese mismo archivo.

Sin WebGL 2 se muestra una captura fija; con "reducir movimiento" no hay
caída ni vuelo de cámara.

## Vista previa al compartir

`public/og-image.jpg` (1200×630) es la tarjeta que muestran WhatsApp,
Instagram y otras redes al pegar el link. Si cambia el titular o la marca,
conviene regenerarla; la URL está en las etiquetas `og:image` de `index.html`.

## Contacto

WhatsApp e Instagram están centralizados en `src/data/site.js` y se reusan en
todos los llamados a la acción.

## Visitas

Las visitas se cuentan con [GoatCounter](https://www.goatcounter.com) (gratis,
sin cookies). El código del sitio va en `GOATCOUNTER_CODE` en
`src/data/site.js`; con `null` no se cuenta nada. Solo corre en el build de
producción, así que `npm run dev` no suma visitas.

En el panel aparecen:

- `/?lang=es` y `/?lang=en`: visitas, según el idioma en que se vio la página.
- `click-whatsapp`, `click-instagram`, `click-email`, `click-github`: clics en
  los links de contacto. El título dice desde qué sección (`header`, `top`,
  `servicios`, `contacto`, `menu-fullscreen`).

La lógica está en `src/lib/analytics.js`.
