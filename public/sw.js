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
            'offline.json'
        ]);
    }));
});

self.addEventListener('activate', (event) => {
    console.info('SW: activate');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async (event) => {
    console.info('SW: fetch');
    
    event.respondWith(
        (async () => {
            const cacheHorsLigne = await caches.open(CLE_HORS_LIGNE);
            try {
                return await fetch(event.request);
            } catch(e) {
                console.dir(e)
               
                if (event.request.url.includes('cms-headless-core')) {
                    return await cacheHorsLigne.match("/offline.json");
                }
                
                return await cacheHorsLigne.match("/offline.html");
            }
        })(),
    );
});
