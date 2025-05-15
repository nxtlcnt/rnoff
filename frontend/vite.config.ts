import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/gee": {
        target: "http://localhost:8002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gee/, "/api/gee"),
      },
      "/api/chat": {
        target: "http://localhost:8001",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
