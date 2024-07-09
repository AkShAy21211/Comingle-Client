const cacheData = "app-chache-v1";

this.addEventListener("install", (event) => {
  const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,100..900;1,100..900&display=swap",
    "/register",
    "/verify-otp",
    "/login",
    "/post/:id",
    "/profile",
    "/settings",
    "/details",
    "/forgot-password",
    "/explore",
    "/profile/:username",
    "/notifications",
    "/settings/subscription",
    "/chats",
    "/*",
  ];

  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll(urlsToCache);
    })
  );
});

this.addEventListener("activate", (event) => {
  console.log("service worker activated", event);
});

this.addEventListener("fetch", (event) => {
 event.respondWith(
    caches.open(cacheData).then((cache) => {
      return cache.match(event.request).then((response) => {
        if (response) {
          return response; // Serve cached resource if available
        }

        return fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
        });
      });
    })
  );});
