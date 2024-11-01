/*importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');
workbox.set.setConfig({
    debug: false
})*/
const SW_VERSION = "1.0.0"
const CACHE_NAME = 'api-cache';
const FAKE_CACHE_NAME = 'fake-cache';
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
        const cache = await caches.open(CACHE_NAME);
        const fakeCache = await caches.open(FAKE_CACHE_NAME);
        const cachedRessource = await cache.match(event.request);
        if (cachedRessource) {
            const dataCached = await fakeCache.match(event.request.url)
            const objectCached = await dataCached.json()
            const { numberOfCall, quantityOfOneCall } = objectCached
            console.log("Service Worker: Cache hit value ", numberOfCall+1 ," times & url'" , event.request.url," '& quantityOfData'", quantityOfOneCall);
            const fakeObject = {...objectCached, numberOfCall: numberOfCall+1}
            fakeCache.put(event.request.url, new Response(JSON.stringify(fakeObject)));
            //console.log("Service Worker: Cache hit value", value, '& url', event.request.url);
            return cachedRessource;
        }
        try {
            const response = await fetch(event.request);
            let quantityOfData = 0
            if(response.headers.get("content-length")) {
                quantityOfData = Number(response.headers.get("content-length"))
            }else {
                const encoder = new TextEncoder();
                const bytes = encoder.encode(response.body);
                const contentSize = bytes.length;
                quantityOfData = contentSize;
            }
            const fakeObject = {numberOfCall: 0, quantityOfOneCall: quantityOfData}
            fakeCache.put(event.request.url, new Response(JSON.stringify(fakeObject)));
            console.log("Service Worker: Cache miss & quantityOfData", quantityOfData);
            const cache =  await caches.open(CACHE_NAME)
            cache.put(event.request, response);
            return response;
        } catch (error) {
            console.log("Service Worker: Error: ", error);
        }
    }
    /*
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
        event.respondWith(result);*/
});
