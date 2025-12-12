import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/React-Google-Maps-Directions-App/",
  server:{
    port:8000
  }
})
