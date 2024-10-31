const SW_VERSION = "1.0.0"
let numberOfCall = 0
let quantityOfData = 0
self.addEventListener('message', (event) => {
    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage(SW_VERSION);
    }
});

self.addEventListener('install', (event) => {
    console.info('SW: install');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.info('SW: activate');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', async (event) => {
    if (event.request.url.includes('livres')) { // on met en cache uniquement les requêtes à 'livres'
        const cache = await caches.match(event.request);
        if (cache) {
            console.log("Service Worker: Cache hit");
            return cache;
        }
        try {
            const response = await fetch(event.request);
            await caches.open('api-cache').then(function(cache) {
                console.log("Service Worker: Cache miss");
                cache.put(event.request, response);
            });
            return response;
        } catch (error) {
            console.log("Service Worker: Error: ", error);
        }
    }

    const result = fetch(event.request)
    numberOfCall += 1

    result.then(response => {
        if(response.headers.get("content-length")) {
            quantityOfData += Number(response.headers.get("content-length"))
        }else {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(response.body);
            const contentSize = bytes.length;
            quantityOfData += contentSize;           }
    })

    console.log("numberOfCall", numberOfCall)
    console.log("quantityOfData", quantityOfData/1024/1024)
    event.respondWith(result);
});
