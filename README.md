# CatálogoMineral

Aplicación web progresiva (PWA) para catalogar, gestionar y compartir una
colección de minerales. Funciona sin conexión gracias a IndexedDB y un service
worker, y sincroniza los datos con Firebase cuando hay red.

## Características

- **Offline-first**: añade, edita y consulta minerales sin conexión; los cambios
  se sincronizan automáticamente al recuperar la red mediante una cola local.
- **Fichas detalladas**: nombre, fórmula química (con subíndices), imágenes,
  etiquetas de color y campos personalizados por mineral.
- **Imágenes optimizadas**: las fotos se comprimen a WebP en tres tamaños
  (`sm`/`md`/`lg`) con un placeholder borroso para carga progresiva.
- **Compartir**: genera un enlace y un código QR para mostrar tu catálogo en modo
  solo lectura. Cada mineral tiene además su propia ficha accesible por QR.
- **Estadísticas**: índice de calidad de datos, superlativos, distribución por
  campos y evolución de la colección con Chart.js.
- **Exportación**: a JSON (copia de seguridad) y a PDF con miniaturas y QR.

## Tecnologías

- HTML, Tailwind CSS (CDN) y JavaScript (módulos ES, sin framework).
- Firebase: Authentication, Cloud Firestore y Cloud Storage.
- IndexedDB para el almacenamiento local y Workbox para el service worker.
- Chart.js, qrcode, jsPDF y browser-image-compression.

## Estructura

```
.
├── firebase.json          # Hosting + reglas de Firestore/Storage
├── firestore.rules        # Reglas de seguridad de Firestore
├── storage.rules          # Reglas de seguridad de Storage
├── cors.json              # Configuración CORS del bucket de Storage
└── public/                # Raíz del sitio
    ├── index.html         # Landing
    ├── login.html         # Acceso / registro
    ├── catalog.html       # Catálogo principal (app)
    ├── ficha.html         # Ficha individual (destino de los QR)
    ├── share.html         # Vista de catálogo compartido
    ├── stats.html         # Estadísticas
    ├── firebase-config.js # Configuración de Firebase compartida
    ├── utils.js           # Utilidades (escape de HTML, formato de fórmula…)
    ├── sw.js              # Service worker (Workbox)
    └── manifest.json      # Manifiesto PWA
```

## Puesta en marcha

Requiere [Node.js](https://nodejs.org/) y Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

Para servir el sitio en local:

```bash
firebase serve
```

> La app usa módulos ES con rutas absolutas (`/firebase-config.js`,
> `/utils.js`), por lo que debe servirse por HTTP. Abrir los `.html`
> directamente con `file://` no funciona.

## Configuración de Firebase

El proyecto está vinculado en `.firebaserc`. La configuración del cliente vive en
`public/firebase-config.js`. La `apiKey` de un proyecto web de Firebase es un
identificador público, no un secreto: la seguridad real depende de las reglas y,
opcionalmente, de [App Check](https://firebase.google.com/docs/app-check).

Las reglas incluidas en `firestore.rules` y `storage.rules` reflejan el
comportamiento de la app:

- `users/{uid}/minerals`: privado, solo el propietario.
- `public_minerals`: lectura pública, escritura solo del propietario.
- `share_links`: lectura pública, escritura solo del propietario.
- Storage `users/{uid}/images`: lectura pública, escritura solo del propietario.

Despliegue:

```bash
firebase deploy                       # todo (hosting + reglas)
firebase deploy --only hosting        # solo el sitio
firebase deploy --only firestore,storage   # solo las reglas
```

> Revisa las reglas antes de desplegarlas: al estar enlazadas en `firebase.json`,
> `firebase deploy` sobrescribirá las que tengas en la consola.

## Notas de seguridad y privacidad

- Para compartir, la app publica una copia de cada mineral en `public_minerals`,
  que es de **lectura pública**. No guardes información sensible en los campos.
- El token para compartir es el `uid` del usuario, por lo que el enlace **no se
  puede revocar** de forma individual. Como mejora futura conviene usar tokens
  aleatorios revocables en lugar del `uid`.

## Licencia

[MIT](LICENSE).
