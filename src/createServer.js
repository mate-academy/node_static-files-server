'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');

      return res.end('Bad url');
    }

    const normalizedUrl = req.url.replace(/\/{2,}/g, '/'); // normalize // to /

    const url = new URL(normalizedUrl, 'http://localhost:5701');
    const requestedPath =
      url.pathname.replace(/^\/file\/?/, '') || 'index.html';

    const basePath = path.resolve(__dirname, '..', 'public');
    const fullPath = path.resolve(basePath, requestedPath);

    if (!fullPath.startsWith(basePath)) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain');

      return res.end('Bad Request: Traversal attempt');
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('content-type', 'text/plain');

        return res.end('non existing file');
      }

      res.statusCode = 200;
      res.setHeader('content-type', 'text/plain');

      return res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
