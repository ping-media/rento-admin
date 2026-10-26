import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    esbuild:
      mode === "production" ? { drop: ["console", "debugger"] } : undefined,
    plugins: [react()],
    optimizeDeps: {
      exclude: ["redux-persist"],
    },
    server: {
      port: 5174,
      proxy: {
        "/api": {
          target: "https://maps.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/fast": {
          target: "https://www.fast2sms.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fast/, ""),
        },
      },
    },
    build: {
      assetsInlineLimit: 0, // Ensures assets have unique hashes
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
    },
  };
});
