'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (
      !(
        pathname === '/file' ||
        pathname === '/file/' ||
        pathname.startsWith('/file/')
      )
    ) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hint: Use /file/<filename> to access static files.');

      return null;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');

      return null;
    }

    let requested = pathname.slice('/file/'.length);

    if (!requested) {
      requested = 'index.html';
    }

    const publicPath = path.join(__dirname, '..', 'public');
    const realPath = path.normalize(path.join(publicPath, requested));

    if (!realPath.startsWith(publicPath + path.sep)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');

      return null;
    }

    fs.readFile(realPath, 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');

        return null;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    });
  });
}

module.exports = { createServer };
