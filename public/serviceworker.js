const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];
const self = this; // representerar service workern

// installera serviceworkder,
// lägger in filer i cachen så den hålls öppen under sidomladdningar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

// lyssna på requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request) // matchar alla requests som sidan får, api-anrop
      .then(() => {
        return fetch(event.request) // gör anrop mot apiet för att få senaste datan
          .catch(() => {
            return caches.match('offline.html'); // om det inte går att göra anropet då kommer cachen visas
          });
      }),
  );
});
// aktivera service worker
// tar bort tidigare cache och sparar det nyaste
self.addEventListener('activate', (event) => {
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          // loopar igenom cacheNames och kontroller om cacheWhiteList inte innehåller cachename
          // såv ill vi ta bort cachneName, men om det inkluderas ska vi spara det,
          // när vi uppdaterar kommer endast det senaste finnnas
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
