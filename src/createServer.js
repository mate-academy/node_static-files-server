'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const url = req.url || '';
    let requestPath = url.slice('/file/'.length);

    if (!url.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use /file/<filename> to load files');

      return;
    }

    if (!url.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Use /file/<filename> to load files');
    }

    if (requestPath === '') {
      requestPath = 'index.html';
    }

    if (requestPath.startsWith('/')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');

      return;
    }

    const publicDir = path.resolve(__dirname, '..', 'public');

    const filePath = path.resolve(publicDir, requestPath);

    const relative = path.relative(publicDir, filePath);

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');

        return;
      }

      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');

          return;
        }

        res.writeHead(200);
        res.end(data);
      });
    });
  });
}

module.exports = {
  createServer,
};
