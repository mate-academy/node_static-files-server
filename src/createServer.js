'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  return MIME_TYPES[ext] || 'application/octet-stream';
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // duplicated slashes
    if (url.pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end();
    }

    // exactly /file
    if (url.pathname === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Use /file/<filename>');
    }

    // invalid route
    if (!url.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Use /file/<filename>');
    }

    const relativePath = url.pathname.replace(/^\/file\/?/, '') || 'index.html';

    const publicDir = path.resolve(__dirname, '..', 'public');
    const fullPath = path.resolve(publicDir, relativePath);

    // защита от path traversal
    if (!fullPath.startsWith(publicDir + path.sep) && fullPath !== publicDir) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad request');
    }

    try {
      const data = fs.readFileSync(fullPath);
      const contentType = getMimeType(fullPath);

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not found');
    }
  });
}

module.exports = {
  createServer,
};
