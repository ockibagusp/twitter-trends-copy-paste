import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// [solved] https://dev.to/boostup/uncaught-referenceerror-process-is-not-defined-12kg
const cherryPickedKeys = [
  'HOST',
  'REGEXTWEETS',
  'REGEXYOUTUBEVIDEO',
  'REGEXYOUTUBEVIDEOTITLE',
  'YOUTUBE',
  'TAGS',
  'JOIN'
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const processEnv: any = {}
  cherryPickedKeys.forEach((key) => (processEnv[key] = env[key]))

  return {
    base: '/twitter-trends/',
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@interface': fileURLToPath(new URL('./src/interface', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    },
    define: {
      'process.env': processEnv
    }, // options...
    server: {
      proxy: {
        '/youtube': {
          target: 'https://www.youtube.com/',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/youtube/, '')
        },
        '/x': {
          target: 'https://x.com/',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/x/, '')
        }
      }
    }
  }
})
