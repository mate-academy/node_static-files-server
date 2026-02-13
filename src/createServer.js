'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const publicDir = path.resolve(__dirname, '..', 'public');

  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('content-type', 'text/plain');

    const isValidRoute =
      pathname === '/file' ||
      pathname === '/file/' ||
      pathname.startsWith('/file/');

    if (!isValidRoute) {
      res.statusCode = 400;
      res.end('Use /file/<path> to load files');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Paths having duplicated slashes');

      return;
    }

    let subPath = pathname.replace(/^\/file(?=\/|$)/, '');

    if (subPath === '' || subPath === '/') {
      subPath = '/index.html';
    }

    subPath = subPath.replace(/^\/+/, '');

    const resolvedPath = path.resolve(publicDir, subPath);

    if (!resolvedPath.startsWith(publicDir)) {
      res.statusCode = 404;
      res.end('Non-existent files');

      return;
    }

    fs.stat(resolvedPath, (err, stats) => {
      if (err) {
        res.statusCode = 404;
        res.end('Non-existent files');

        return;
      }

      let filePath = resolvedPath;

      if (stats.isDirectory()) {
        filePath = path.join(publicDir, 'index.html');
      }

      fs.readFile(filePath, (readErr, file) => {
        if (readErr) {
          res.statusCode = 404;
          res.end('Non-existent files');

          return;
        }

        res.statusCode = 200;
        res.end(file);
      });
    });
  });

  return server;
}

module.exports = {
  createServer,
};
