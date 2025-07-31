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
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          icons: ['lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          query: ['@tanstack/react-query'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
}));
