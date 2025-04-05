const CACHE_NAME = 'version-1';
const urlsToCache = [
  '/',
  'index.html',
  'offline.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/css/main.chunk.css',
  '/images/dumbbell-35686.png',
];

// represents serviceworker
const self = this;

// install serviceworker and open cache and adding files to cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

// listen to requests and check if the response is cached, if not make new request and if error show offline.html
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => caches.match('/offline.html'));
    }),
  );
});

// activate service worker
// remove old cache and saving the newest
self.addEventListener('activate', (event) => {
  // to keep the cache we want to save
  const cacheWhiteList = [];
  // adding the cache version to array
  cacheWhiteList.push(CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          // checking if the latest version is in cacheWhiteList
          // if the latest version does not exist, delete the cacheName
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
