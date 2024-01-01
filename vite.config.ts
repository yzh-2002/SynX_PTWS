import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import { join, resolve } from "path"
import svgrPlugin from "vite-plugin-svgr"

import { MOCK_PORT, PROXY, entryKey } from "./config/global"
import { ViteMockApiPlugin } from "./mock"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteMockApiPlugin({ port: MOCK_PORT }),
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
  }
  // TODO：mpa，build时也需要特殊配置
})
