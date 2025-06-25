/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  build: {
    manifest: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - changes rarely, good for caching
          "react-vendor": ["react", "react-dom"],

          // Routing - only needed on navigation
          router: ["react-router-dom"],

          // UI libraries - moderate size, stable
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-slot",
            "vaul",
            "sonner",
            "lucide-react",
          ],

          // Backend sync - optional feature
          convex: ["convex"],

          // State management and utilities
          utils: [
            "zustand",
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
            "use-debounce",
          ],

          // Theme and transitions
          "ui-support": ["next-themes", "react-transition-group"],

          // QR code generation (used conditionally)
          qr: ["qrcode-svg"],
        },
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    svgr({
      include: ["**/cards/*.svg", "**/icons/logo.svg"],
      svgrOptions: {
        dimensions: false,
        exportType: "default", // Ensure default export is a component
      },
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      workbox: {
        skipWaiting: false,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        // Enable proper cache invalidation for JS assets
        dontCacheBustURLsMatching: /\.(css|less|sass|scss|styl|stylus|pcss|postcss)$/,
        // Cache external fonts
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
              },
            },
          },
          // Cache-first for JS assets - more reliable on mobile
          {
            urlPattern: /\.js$/,
            handler: "CacheFirst",
            options: {
              cacheName: "js-assets",
              cacheableResponse: {
                statuses: [0, 200],
              },
              plugins: [
                {
                  cacheKeyWillBeUsed: async ({ request }) => {
                    // Use URL + content hash for cache key to ensure proper invalidation
                    return request.url;
                  },
                  cachedResponseWillBeUsed: async ({ cachedResponse, request }) => {
                    // If cached response is corrupted, fetch from network
                    if (cachedResponse) {
                      try {
                        const clone = cachedResponse.clone();
                        await clone.text(); // Test if response is readable
                        return cachedResponse;
                      } catch (error) {
                        console.warn('Corrupted cache detected, fetching from network:', request.url);
                        return fetch(request);
                      }
                    }
                    return null;
                  },
                },
              ],
            },
          },
        ],
        navigateFallback: "/index.html", // Serve index.html for all routes (SPA routing)
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Court Shuffle",
        short_name: "CourtShuffle",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#333333",
        theme_color: "#333333",
        icons: [
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
