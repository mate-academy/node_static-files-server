'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function createServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (
      pathname !== '/file' &&
      pathname !== '/file/' &&
      !pathname.startsWith('/file/')
    ) {
      res.statusCode = 400;

      return res.end(
        `Please request your files starting with /file/... (e.g. /file/index.html or /file/styles/main.css)`,
      );
    }

    let relativePath;

    if (pathname === '/file' || pathname === '/file/') {
      relativePath = 'index.html';
    } else {
      relativePath = pathname.replace(/^\/file/, '').replace(/^\/+/, '');

      if (!relativePath) {
        relativePath = 'index.html';
      }
    }

    if (/\/{2,}/.test(relativePath)) {
      res.statusCode = 404;

      return res.end('File not found');
    }

    relativePath = path.normalize(relativePath).replace(/^\/+/, '');

    const publicDir = path.resolve(__dirname, '../public');
    const resolvedPath = path.resolve(publicDir, relativePath);
    const rel = path.relative(publicDir, resolvedPath);

    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      res.statusCode = 403;

      return res.end('Access denied!');
    }

    fs.readFile(resolvedPath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');

        return res.end('File not found');
      }

      const ext = path.extname(resolvedPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
