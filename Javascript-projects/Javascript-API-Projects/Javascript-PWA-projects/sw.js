// --- sw.js ---

// 1. Install Event: Runs when the browser first sees the service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    // This creates the cache immediately
    event.waitUntil(
        caches.open('static-v1').then((cache) => {
            console.log('Caching files...');
            // You can add your files here later, but it's not strictly required for the button
            return cache.addAll(['./', './index.html', './CSS/style.css', './js/script.js']);
        })
    );
});

// 2. Activate Event: Runs after the service worker is installed
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // This cleans up old caches
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== 'static-v1')
                .map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch Event: CRITICAL FOR PWA BUTTON
// The browser checks for this event listener. If it's missing, the app is not "installable."
self.addEventListener('fetch', (event) => {
    // This tries to get the file from the cache first; if not there, it goes to the network
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});