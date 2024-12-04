self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('chat-app').then(cache => {
        cache.addAll([
          '/',
          '/icon.png',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }).catch(() => {
        return fetch(event.request).then(res => {
          const response = res.clone();
          caches.open('chat-app').then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
  
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all([
          ...cacheNames.slice(1),
          cacheNames[0],
        ]).then(keys => keys.map(key => caches.delete(key)));
      })
    );
  });