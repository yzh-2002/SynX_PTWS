import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import { join, resolve } from "path"
import svgrPlugin from "vite-plugin-svgr"
import legacy from "@vitejs/plugin-legacy"

import { MOCK_PORT, PROXY, entryKey } from "./config/global"
// 页面打包时记得注释掉
// import { ViteMockApiPlugin } from "./mock"


// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    react(),
    // ViteMockApiPlugin({ port: MOCK_PORT }),
    svgrPlugin()
  ],
  resolve: {
    alias: {
      '@': join(__dirname, 'src')
    }
  },
  root: resolve('src', 'pages', entryKey),
  server: {
    host: '0.0.0.0',
    proxy: PROXY
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist', entryKey),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        [entryKey]: resolve(__dirname, 'src', 'pages', entryKey, 'index.html')
      }
    }
  }
})
