import path from "path"
import tailwindcss from "@tailwindcss/vite"

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generouted from '@generouted/react-router/plugin'

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    generouted({
      source: {
        routes: path.resolve(__dirname, "src/routes"),
        modals: path.resolve(__dirname, "src/modals"),
      }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})