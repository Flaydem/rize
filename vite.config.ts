import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ['inertia/app/app.tsx', 'inertia/app/app.css'],
      reload: ['resources/views/**/*.edge'],
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './inertia'),
    },
  },
})
