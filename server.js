/**
 * Lightweight production static server for Render / Container web services.
 * Uses zero external dependencies (Node.js built-ins only).
 * Handles SPA fallback to index.html for client-side routing.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DIST_DIR = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.task': 'application/octet-stream',
  '.wasm': 'application/wasm',
}

const server = http.createServer((req, res) => {
  // Normalize URL and remove query strings
  const cleanUrl = req.url.split('?')[0]
  let filePath = path.join(DIST_DIR, cleanUrl)

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      // Serve existing static file
      serveFile(filePath, res)
    } else {
      // SPA Fallback: serve index.html for React Router
      const indexPath = path.join(DIST_DIR, 'index.html')
      serveFile(indexPath, res)
    }
  })
})

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end('Server Error')
      return
    }

    const headers = {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    }

    // Cache hashed assets aggressively
    if (filePath.includes(`${path.sep}assets${path.sep}`)) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable'
    } else {
      headers['Cache-Control'] = 'public, max-age=0, must-revalidate'
    }

    res.writeHead(200, headers)
    res.end(content)
  })
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SkinSync production server listening on http://0.0.0.0:${PORT}`)
})
