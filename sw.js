;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_programador_fitness',
  urlsToCache = [
    './',
    'https://fonts.googleapis.com/css?family=Raleway:400,700',
    'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
    'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2',
    './style.css',
    './script.js',
    './img/ProgramadorFitness.png',
    './img/favicon.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil( /* esperar hasta */
    caches.open(CACHE_NAME)  /* Objeto global "cache", Abre un caché específico identificado por su nombre. Si no existe, lo crea. Este método devuelve una promesa que se resuelve con el objeto de caché. */
      .then(cache => {
        return cache.addAll(urlsToCache) /* agrega todo */
          .then(() => self.skipWaiting()) /* seguir esperando hasta que termine toda la lista */
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME] /* lista blanca del cache, es una copia para comparar sila copia del cache que teniamos ha cambiado, es un arreglo, hasta ahora hay solo una cache,CACHE_NAME  */

  e.waitUntil(
    caches.keys() /*  Devuelve una promesa que se resuelve con un array de nombres de todos los cachés existentes bajo el alcance del Service Worker. Es este método el que se usa en tu código para obtener una lista de todos los cachés existentes. */
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => { /* mapeado para revisar los elementos de a "cache" */
            //Eliminamos lo que ya no se necesita en cache, si ha cambiado algo se elimina
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
      /* La línea .then(() => self.clients.claim()) en el contexto de un Service Worker tiene un propósito muy específico en la fase de activación del mismo. Expliquemos qué hace y por qué es importante:

Funcionalidad de self.clients.claim()
Contexto: En un Service Worker, self se refiere al propio Service Worker. Es equivalente a this, pero se usa self en lugar de this para seguir el patrón de los workers en JavaScript.

clients.claim(): Este método permite que el Service Worker activo "reclame" control sobre todas las páginas abiertas que están dentro de su alcance. Sin self.clients.claim(), solo las páginas que se cargan después de que el Service Worker se haya activado reconocerán y utilizarán ese Service Worker. Con self.clients.claim(), el Service Worker toma el control inmediato de las páginas abiertas, permitiendo que empiece a manejar eventos de fetch y mensajes para esas páginas de inmediato.

Importancia en el Ciclo de Vida del Service Worker
Inicio Rápido de Control: Sin self.clients.claim(), los usuarios tendrían que cerrar completamente su sitio web (todas las instancias del mismo) y volver a abrirlo para que el Service Worker se active en todas las páginas del sitio. Con self.clients.claim(), este paso se omite, y el Service Worker se activa inmediatamente en todas las páginas.

Mejora de la Experiencia del Usuario: Esto es especialmente importante para mejorar la experiencia del usuario en actualizaciones de la aplicación, ya que permite que los cambios realizados en el Service Worker se reflejen inmediatamente sin necesidad de recargar las páginas manualmente.

Ejemplo de Flujo de Trabajo
Instalación del Service Worker: El usuario visita tu sitio web por primera vez y el Service Worker se instala.

Activación del Service Worker: Después de la instalación, el Service Worker se activa. Si self.clients.claim() está presente, el Service Worker comienza a controlar las páginas del sitio inmediatamente.

Control Inmediato: Todas las páginas abiertas bajo el alcance del Service Worker ahora están bajo su control, permitiendo que gestione las solicitudes de red, caché y otras funciones sin necesidad de que el usuario recargue las páginas.

En resumen, self.clients.claim() en un Service Worker es una declaración poderosa que permite que el Service Worker activo comience a gestionar todas las páginas abiertas bajo su alcance de forma inmediata, sin necesidad de recargas adicionales, lo que mejora la experiencia de integración y actualización del Service Worker. */
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real, /* evaluar la respuesta */
  e.respondWith(
    caches.match(e.request)/* promesa que devuelve una respuesta, si la respuesta se recupera de la cache, es decir si la "url" es real, si no se detectan cambios devuelve lo que esta en la cache, si la cache existe devueleve la promesa, si no lo recupero y tuvo que consultar una "url" del servidor para cargarl, ene ste caso se solicita la petiicion y se carga, se retorna, como esta abjo */
      .then(res => {
        if (res) { /* si aca esta, existe "res" en el "cache", lo devuelve */
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request) /* ca ocurre que busca la url del , porque no esta en la cache */
      })
  )
})
/* codigo optimizado // Asignar un nombre y versión al caché
const CACHE_NAME = 'v1_cache_programador_fitness';
const urlsToCache = [
  './',
  'https://fonts.googleapis.com/css?family=Raleway:400,700',
  'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
  'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
  'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2',
  './style.css',
  './script.js',
  './img/ProgramadorFitness.png',
  './img/favicon.png'
];

// Durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', async e => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urlsToCache);
    self.skipWaiting();
  } catch (err) {
    console.log('Falló registro de cache', err);
  }
});

// Una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', async e => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
      self.clients.claim();
    })()
  );
});

// Cuando el navegador recupera una url
self.addEventListener('fetch', async e => {
  e.respondWith(
    (async () => {
      const response = await caches.match(e.request);
      return response || fetch(e.request);
    })()
  );
});
 */