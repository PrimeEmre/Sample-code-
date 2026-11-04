// Minimal service worker — exists mainly to satisfy Chrome's installability
// requirement (manifest + HTTPS + a fetch handler) and to cache static,
// unchanging assets (CSS/JS/icons) for faster repeat loads.
//
// Deliberately does NOT cache anything dynamic: /api/*, /speak, /login,
// /register, /Login.html, /chat.html, etc. all go straight to the network,
// untouched. Caching an AI reply, a generated voice clip, or a logged-in
// page would be actively wrong here — those must always be fresh.
// Bumped to v2 specifically to force every existing installed copy of this
// service worker to throw away its old cache — v1's cache-first strategy
// below (now replaced) was silently serving stale JS/CSS forever, since none
// of this app's <script>/<link> tags bump their ?v= query string on every
// edit. Real symptom this caused: multiple chat.js fixes (translations, a
// language-detection fix) were invisible in the browser because the SW kept
// answering from its very first cached copy, never re-checking the network.
const CACHE_NAME = 'ibochat-static-v2';
const STATIC_PATTERNS = [/^\/static\//, /^\/Chat_icon\//, /^\/Loginicon\//, /^\/favicon\.ico$/];

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only ever intervene for same-origin GET requests to the static
    // patterns above — everything else (API calls, page navigations, POSTs,
    // cross-origin CDN scripts) passes straight through untouched.
    if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
    if (!STATIC_PATTERNS.some((re) => re.test(url.pathname))) return;

    // Stale-while-revalidate instead of cache-first: still answers instantly
    // from cache when there's a hit, but every request also goes to the
    // network in the background and refreshes the cache for next time —
    // so an edit to a static file shows up on the *next* load instead of
    // being invisible until someone thinks to bump a ?v= number or clear
    // site data.
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(event.request);
            const networkFetch = fetch(event.request).then((resp) => {
                if (resp.ok) cache.put(event.request, resp.clone());
                return resp;
            }).catch(() => cached); // offline with nothing cached — let it fail naturally
            return cached || networkFetch;
        })
    );
});
