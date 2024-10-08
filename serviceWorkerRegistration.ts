



export function registerServiceWorker(): void {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(() => {
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    } else {
      console.log("Service Worker is not supported.");
    }
  }
  
  export function unregisterServiceWorker(): void {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error("Service Worker unregistration failed:", error);
        });
    }
  }
  