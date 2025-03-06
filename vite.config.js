import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "0.0.0.0",
      port: 5172,
    },
    build: {
      manifest: true,
      sourcemaps: true,
    },
    plugins: [
      svgr({
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        include: [/\/cards\/.*svg/, /\/icons\/.*svg/],
        svgoConfig: {
          floatPrecision: 2,
          icon: true,
          ref: true,
          memo: true,
        },
        // svgr options: https://react-svgr.com/docs/options/
        svgrOptions: {
          dimensions: false,
        },
      }),
      react(),
      VitePWA({
        registerType: "autoUpdate",
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
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
      }),
    ],
  };
});
