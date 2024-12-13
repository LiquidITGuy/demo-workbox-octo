const SW_VERSION = "1.0.0"
const CLE_HORS_LIGNE = 'offline';
const CLE_RESSOURCES = 'ressources';

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
            // Si l'url de la requete provient d'une extension chrome
            if(event.request.url.includes('chrome-extension')){
                // renvoie le résultat de notre requete
                return await fetch(event.request);
            }
            
            // ouverture ou création des caches
            const cacheRessources = await caches.open(CLE_RESSOURCES);
            
            try {
                // stocke le résultat de la requete
                const result = await fetch(event.request);
                // place le resultat dans le cache
                await cacheRessources.put(event.request, result.clone())
                // renvoie le resultat
                return result
            } catch (e) {
                // renvoie la page cachée
                return cacheRessources.match(event.request)
            }
            
        })(),
    );
});
