const CACHE_NAME = 'application-capabilities-demo';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if (event.tag !== 'application-capabilities-demo-sync') {
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.put(
        '/__application-sync__',
        new Response(JSON.stringify({ syncedAt: new Date().toISOString() }), {
          headers: { 'content-type': 'application/json' },
        }),
      ),
    ),
  );
});