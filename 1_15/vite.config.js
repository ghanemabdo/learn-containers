import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Feeds don't send CORS headers, so the dev server proxies them: /feeds/<name> -> feed URL.
const feeds = {
  bbc: ['https://feeds.bbci.co.uk', '/news/rss.xml'],
  npr: ['https://feeds.npr.org', '/1001/rss.xml'],
  guardian: ['https://www.theguardian.com', '/world/rss'],
  aljazeera: ['https://www.aljazeera.com', '/xml/rss/all.xml'],
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    proxy: Object.fromEntries(
      Object.entries(feeds).map(([name, [target, path]]) => [
        `/feeds/${name}`,
        { target, changeOrigin: true, rewrite: () => path },
      ])
    ),
  },
})
