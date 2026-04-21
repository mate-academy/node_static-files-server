'use strict';

const path = require('node:path');
const http = require('node:http');
const fsp = require('node:fs/promises');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;
    const publicDir = path.resolve(__dirname, '..', 'public');
    const requestedPath =
      pathname === '/file' || pathname === '/file/'
        ? 'index.html'
        : pathname.replace(/^\/file\/?/, '');
    const decodedPath = decodeURIComponent(requestedPath);
    const normalizedPath = path.normalize(decodedPath);
    const realPath = path.resolve(publicDir, normalizedPath);

    if (/\/{2,}/.test(requestedPath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not Found');
    }

    if (!realPath.startsWith(publicDir + path.sep)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad Request');
    }

    if (!pathname.startsWith('/file')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Use /file/<filename> to load files');
    }

    try {
      const file = await fsp.readFile(realPath);

      res.statusCode = 200;
      res.setHeader('Content-Type', getContentType(realPath));
      res.end(file);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = { createServer };
