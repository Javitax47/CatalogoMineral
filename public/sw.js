// public/sw.js

// Importa las librerías de Workbox desde el CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Comprobamos que Workbox se haya cargado antes de usarlo para evitar el error
// "script evaluation failed" si el CDN no está disponible.
if (workbox) {
  console.log(`Service Worker: Workbox ha sido cargado exitosamente.`);

  // Estas directivas son buenas prácticas para que el nuevo Service Worker
  // tome el control de la página de inmediato en cuanto se activa.
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Nombres de caché
  const CACHE_NAME_ASSETS = 'asset-cache-v1';
  const CACHE_NAME_IMAGES = 'image-cache-v1';

  // Cache para assets principales (CSS, JS, etc.)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' ||
                     request.destination === 'script' ||
                     request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME_ASSETS,
    })
  );

  // Cache para Google Fonts (stylesheets)
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  // Cache para Google Fonts (archivos de fuentes)
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  // Cache para CDNs de JavaScript
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://cdn.jsdelivr.net' || url.origin === 'https://cdn.tailwindcss.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME_ASSETS,
    })
  );

  // Cache para imágenes (incluyendo las de Firebase Storage)
  // Se mantiene la estrategia StaleWhileRevalidate para evitar errores con respuestas fallidas cacheadas.
  workbox.routing.registerRoute(
    ({ request, url }) => request.destination === 'image' || url.origin === 'https://firebasestorage.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME_IMAGES,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

} else {
  console.error(`Service Worker: Workbox no se pudo cargar.`);
}