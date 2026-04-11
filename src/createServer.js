'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const rawUrl = req.url;
    const urlPath = rawUrl.split('?')[0];

    if (urlPath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');
      res.end('Not found');

      return;
    }

    if (urlPath.startsWith('/file/')) {
      const relativeRaw = urlPath.slice('/file/'.length);

      let relative;

      try {
        relative = decodeURIComponent(relativeRaw);
      } catch {
        res.statusCode = 400;
        res.setHeader('content-type', 'text/plain');
        res.end('Bad request');

        return;
      }

      if (relative === '') {
        relative = 'index.html';
      } else if (relative.endsWith('/')) {
        relative = `${relative}index.html`;
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

        const extension = path.extname(filePath);

        if (extension === '.html') {
          res.setHeader('content-type', 'text/html');
        } else if (extension === '.css') {
          res.setHeader('content-type', 'text/css');
        }

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