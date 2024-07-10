import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  plugins: [
    react(), // Enable React support

    VitePWA({
      manifest: {
        theme_color: "#004080",
        background_color: "#004080",
        display: "fullscreen",
        scope: "/",
        start_url: "/",
        name: "Comingle",
        short_name: "comingle",
        description: "comingle social media app",
        icons: [
          {
            src: "image/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "image/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [],
      },
      workbox: {
        swDest: "service-worker.js", // Specify service worker file name
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: new RegExp("^https://fonts.googleapis.com"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    strictPort:true,
    port: 3000,
  },
  define: {
    global: "window", // Define global object as window
  },
  build: {
    outDir: "dist", // Specify the output directory
  },
});
