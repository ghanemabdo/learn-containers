# Latest News

React app that fetches the latest articles from the BBC, NPR, The Guardian and Al Jazeera RSS feeds, merges them newest first, and shows 10 per page. Served on port 8080.

The feeds don't allow cross-origin browser requests, so they are proxied under `/feeds/<name>` (Vite in development, nginx in production).

## Development

Requires Node.js 18+.

```
npm install
npm run dev
```

Open http://localhost:8080.

## Production (Docker)

```
docker build -t news-reader .
docker run --rm -p 8080:8080 news-reader
```

Open http://localhost:8080.

### How the Dockerfile works

It is a multi-stage build, so the final image contains only the built site and nginx, not Node or `node_modules`.

1. **Build stage** (`node:20-alpine`)
   - `COPY package*.json` then `npm install`: dependencies are installed before the source is copied, so Docker caches this layer and only reinstalls when `package.json` changes.
   - `COPY . .` then `npx vite build`: compiles the React app into static files in `/app/dist`. (`.dockerignore` keeps `node_modules` and `dist` out of the build context.)
2. **Runtime stage** (`nginx:alpine`)
   - `COPY nginx.conf`: replaces the default nginx site. It listens on port 8080 and proxies `/feeds/bbc`, `/feeds/npr`, `/feeds/guardian` and `/feeds/aljazeera` to the real RSS URLs (the production equivalent of the Vite dev proxy).
   - `COPY --from=build /app/dist`: copies the built site from the first stage into nginx's web root.
   - `EXPOSE 8080`: documents the port; `-p 8080:8080` in `docker run` actually publishes it.

## Notes

- Port 8080 must be free, otherwise the dev server exits with an error.
- If a feed fails to load, the page names it and still shows the other feeds.
