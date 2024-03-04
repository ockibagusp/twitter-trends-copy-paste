import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/twitter-trends/',
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  // $ npm install cors
  // https://expressjs.com/en/resources/middleware/cors.html

  // heroku!

  // server: {
  //   proxy: {
  //     '/url': {
  //       target: 'https://getdaytrends.com/indonesia/bekasi/',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/url/, '')
  //     },
  //   }
  // }
})
