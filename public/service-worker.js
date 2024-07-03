const cacheData = "app-v2";

this.addEventListener("install", (event) => {
  const urlsToCache = [
    "/",
    "/index.html",
    "/login",
    "/user/posts/all",
    "https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,100..900;1,100..900&display=swap",
  ];

  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    event.responseWith(
      caches.match(event.request).then((resp) => {
        if (resp) {
          return resp;
        }
        let requesUrl = event.request.clone();

        return fetch(requesUrl);
      })
    );
  }
});
