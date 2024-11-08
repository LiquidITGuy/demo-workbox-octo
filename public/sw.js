const SW_VERSION = "1.0.0"
const CLE_HORS_LIGNE = 'offline';

self.addEventListener('message', (event) => {
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage(SW_VERSION);
    }
});

self.addEventListener('install', (event) => {
    console.info('SW: install');
    event.waitUntil(self.skipWaiting());
    
    event.waitUntil(caches.open(CLE_HORS_LIGNE).then((cache) => {
        return cache.addAll([
            'offline.html',
        ]);
    }));
});

self.addEventListener('activate', (event) => {
    console.info('SW: activate');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async (event) => {
    console.info('SW: fetch');
    /*try {
        const result = await fetch(event.request)
        
        return result;
    } catch {
        const cache = await caches.open(CLE_HORS_LIGNE);
        const pageHorsLigne = await cache.match("/offline.html");
        return event.respondWith(pageHorsLigne)
    }*/

    // Open the cache
    event.respondWith(caches.open(CLE_HORS_LIGNE).then((cache) => {
        // Go to the network first
        return fetch(event.request).catch(() => {
            // If the network is unavailable, get
            return cache.match("/offline.html");
        });
    }));
});

