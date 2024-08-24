import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// https://vitest.dev/config/file.html#managing-vitest-config-file
export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html']
        },
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url))
      }
      // define: {
      //   'process.env': processEnv
      // }
    })
  )
)
