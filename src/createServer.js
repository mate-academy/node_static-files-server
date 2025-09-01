'use strict';

const path = require('node:path');
const http = require('node:http');
const fsp = require('node:fs/promises');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (!pathname.startsWith('/file')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Use /file/<filename> to load files');
    }

    const requestedPath =
      pathname === '/file' || pathname === '/file/'
        ? 'index.html'
        : pathname.replace(/^\/file\/?/, '');

    if (/\/{2,}/.test(requestedPath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not Found');
    }

    const publicDir = path.resolve(__dirname, '..', 'public');
    const normalizedPath = path.normalize(requestedPath);
    const realPath = path.resolve(publicDir, normalizedPath);

    const relative = path.relative(publicDir, realPath);

    if (relative.split(path.sep)[0] === '..') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad Request');
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

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    case '.html':
      return 'text/plain';
    default:
      return 'text/plain';
  }
}

module.exports = { createServer };
