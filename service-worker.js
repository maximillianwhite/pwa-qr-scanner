const CACHE_NAME = "qr-validator-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/app.js",
    "/manifest.json",
    "/codes.json",
    "/icon-192x192.png",
    "/icon-512x512.png"
];

// Install the service worker and cache files
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Serve cached files when offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
