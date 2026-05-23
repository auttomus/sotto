import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: {
    port: 8080,
    host: "0.0.0.0",
  },
  preview: {
    port: 8080,
    host: "0.0.0.0",
  },
  resolve: {
    tsconfigPaths: true,
  },
});
