// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// export default defineConfig({
//   base: './',   // <-- ЭТО КРИТИЧНО
//   plugins: [react()]
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})