'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
    const fileName = normalizedURL.pathname.slice(1);

    res.setHeader('Content-Type', 'text/plain');

    if (!req.url.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Invalid request');

      return;
    }

    if (!req.url.startsWith('/file/')) {
      res.end('Hint message: Use /file/ to access files');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Invalid path');

      return;
    }

    const requestedPath = fileName.slice(5);

    if (requestedPath.includes('..')) {
      res.statusCode = 400;
      res.end('Traversal detected');

      return;
    }

    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    if (!fs.existsSync(realPath)) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    fs.readFile(realPath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal server error');

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
