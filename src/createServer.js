/* eslint-disable no-console */
'use strict';

const server = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return server.createServer((req, res) => {
    const REQUEST_URL = req.url;

    if (REQUEST_URL.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });

      res.end('Paths having duplicated slashes');

      return;
    }

    const url = new URL(REQUEST_URL, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });

      res.end('Incorrect request address');

      return;
    }

    let normalizedPath = url.pathname.slice(5);

    if (!normalizedPath) {
      normalizedPath = '/index.html';
    }

    const filePath = `./public${normalizedPath}`;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });

        res.end('file not exist!');

        return;
      }

      const ext = path.extname(filePath);

      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.txt': 'text/plain',
      };

      const mimeType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': mimeType });

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
