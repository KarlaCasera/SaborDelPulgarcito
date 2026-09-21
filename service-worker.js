const CACHE_NAME = 'sabor-pulgarcito-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './pupusas.png',
  './tortas.png',
  './enchiladas.png',
  './pastelitos.png',
  './sopa-pollo.png',
  './sopa-frijol.png',
  './fajitas.png',
  './pollo-horneado.png',
  './costillas.png',
  './tamales-pollo.png',
  './tortitas.png',
  './horchata.png',
  './jamaica.png',
  './melon.png',
  './sandia.png',
  './coca-cola.png',
  './sprite.png',
  './seven-up.png',
  './squirt.png',
  './pepsi.png',
  './tortillas.png',
  './promo.png',
  './jacob.png',
  './artemisa.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Solo cachear GET
  if (event.request.method !== 'GET') return;
  
  // No cachear llamadas a Supabase
  if (event.request.url.includes('supabase.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      return caches.match('./index.html');
    })
  );
});
