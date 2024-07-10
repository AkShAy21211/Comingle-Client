const cacheData = "app-cache-v1";

this.addEventListener("install", (event) => {
  const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,100..900;1,100..900&display=swap",
    "/login",
    "/profile",
    "/settings",
    "/explore",
    "/notifications",
    "/chats",
  ];

  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Clear outdated caches during activation
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== cacheData) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (navigator.onLine) {
    let fetchRequest = event.request.clone();
    return fetch(fetchRequest).then((response) => {
      if (!response || response.status !== 200 || response.type !== "basic") {
        return response;
      }

      let responseToCache = response.clone();

      caches.open(cacheData).then((chahe) => {
        chahe.put(event.request, responseToCache);
      });

      return response;
    });
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
      })
    );
  }
});
