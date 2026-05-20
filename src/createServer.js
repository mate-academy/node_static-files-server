'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('To load files, use the path starting with /file/');

      return;
    }

    const normalizedPath = path.normalize(
      pathname.replace('/file', '') || 'index.html',
    );

    const publicPath = path.join(__dirname, '..', 'public');
    const fullPath = path.join(publicPath, normalizedPath);

    const pathSegments = normalizedPath.split(path.sep);

    if (pathSegments.includes('..')) {
      res.statusCode = 400;
      res.end('Bad Request');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Paths having duplicated slashes');

      return;
    }

    if (!fullPath.startsWith(publicPath)) {
      res.statusCode = 400;
      res.end('Bad Request');

      return;
    }

    fs.readFile(fullPath, 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
