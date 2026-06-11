// Service Worker — オフラインキャッシュ
const CACHE = 'artmap-v1';
const ASSETS = [
  '/my-art-map/',
  '/my-art-map/index.html',
  '/my-art-map/style.css',
  '/my-art-map/app.js',
  '/my-art-map/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
