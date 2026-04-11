'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const rawUrl = req.url;

    if (rawUrl.includes('//')) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');
      res.end('Not found');

      return;
    }

    const urlPath = rawUrl.split('?')[0];

    if (urlPath.startsWith('/file/')) {
      const relativeRaw = urlPath.slice('/file/'.length);

      let relative;

      try {
        relative = decodeURIComponent(relativeRaw);
      } catch {
        res.statusCode = 400;
        res.end('Bad request');

        return;
      }

      const publicDir = path.resolve(__dirname, '../public');
      const filePath = path.resolve(publicDir, relative);

      const relativePath = path.relative(publicDir, filePath);

      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        res.statusCode = 400;
        res.setHeader('content-type', 'text/plain');
        res.end('Bad request');

        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('content-type', 'text/plain');
          res.end('Not found');

          return;
        }

        res.statusCode = 200;
        res.end(data);
      });

      return;
    }

    if (urlPath !== '/file') {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/plain');
      res.end('Bad request');

      return;
    }

    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    res.end('Use /file/<filename> to serve a file from the public folder');
  });

  return server;
}

module.exports = {
  createServer,
};
