import path from "path"
import { execFileSync } from 'node:child_process'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react(), {
    name: 'markdown-content',
    configureServer(server) {
      const contentDirectory = path.resolve(__dirname, 'content/posts')
      server.watcher.add(contentDirectory)
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(contentDirectory + path.sep) || !file.endsWith('.md')) return
        try {
          execFileSync(process.execPath, ['scripts/build-content.mjs'], { cwd: __dirname, stdio: 'pipe' })
        } catch (error) {
          server.config.logger.error(`Markdown build failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      })
    },
  }],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
