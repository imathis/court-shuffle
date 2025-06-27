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
      registerType: "autoUpdate",
      devOptions: {
        enabled: false, // Enable in dev for network testing
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/index.html",
        cacheId: "courtshuffle-v3", // Force cache reset
        cleanupOutdatedCaches: true, // Good practice - prevents cache bloat
        skipWaiting: true, // Force immediate activation
        clientsClaim: true, // Take control of uncontrolled clients
        runtimeCaching: [{
          urlPattern: /\.js$/,
          handler: 'StaleWhileRevalidate', // Serve cached JS instantly, update in background
          options: {
            cacheName: 'js-cache',
          }
        }]
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
