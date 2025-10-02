'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const publicDir = path.join(__dirname, 'public');
    const reqPath = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    );

    if (!reqPath.startsWith('/file/') && reqPath !== '/file') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hint: use /file/<filename> to load files');

      return;
    }

    if (reqPath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');

      return;
    }

    const rel = reqPath.replace(/^\/file\/?/, '') || 'index.html';
    const safePath = path.normalize(rel).replace(/^(\.\.[/\\])+/, '');
    const absPath = path.join(publicDir, safePath);

    const isInside =
      absPath.startsWith(publicDir + path.sep) || absPath === publicDir;

    if (!isInside) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Access denied');

      return;
    }

    fs.readFile(absPath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      }
    });
  });

  return server;
}

module.exports = { createServer };
