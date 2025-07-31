import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-button",
            "@radix-ui/react-card",
            "@radix-ui/react-input",
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-badge",
          ],
          charts: ["recharts"],
          query: ["@tanstack/react-query"],
          icons: ["lucide-react"],
          form: ["react-hook-form", "@hookform/resolvers", "zod"],
          carousel: ["embla-carousel-react"],
          animations: ["framer-motion"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
    outDir: "dist",
    emptyOutDir: true,
  },
}));
