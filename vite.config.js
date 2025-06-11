// vite.config.js

import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  root: resolve(__dirname, "."),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Pola file yang akan di-cache oleh Service Worker
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
        // Strategi caching untuk aset tertentu
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fintrack-o1bw\.vercel\.app\/api\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      manifest: {
        name: "FinTrack",
        short_name: "FinTrack",
        description: "Aplikasi manajemen keuangan dan tabungan.",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: '/ss2.png',
            sizes: '356x736',
            type: 'image/png',
          },
          {
            src: '/ss1.png',
            sizes: '1839x948',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      injectRegister: 'auto'
      // Ini akan menginject kode registrasi Service Worker yang dihasilkan oleh VitePWA
      // ke entry point JS Anda secara otomatis.
    }),
  ],
  server: {
    port: 5000,
  },
});