
const staticCacheName = 'MidiaOffline';

const filesToCache = [
  '/',
  '/Azure_midia_offline.html',
  '/assets/style/style.css',
  '/assets/Addons/jquery.min.js',
  '/assets/Addons/pouchdb-7.2.1.min.js',
  '/assets/style/azuremediaplayer.min.css',
  '/assets/js/azuremediaplayer.min.js',
  '/assets/js/Offline/videos.js',
  '/assets/js/Offline/sw_install.js',
  '/favicon.ico',
  '/manifest.json',
  '/assets/style/assets/fonts/azuremediaplayer.woff',
  '/assets/media/iconfinder_image_1055042.png'
];

// Cache on install
this.addEventListener("install", event => {
  this.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
    })
  )
});

// Clear cache on activate
this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('MidiaOffline')))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Serve from Cache
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline/index.html'); //caso nao tenha cahe para a pagina requerida
      })
  )
});