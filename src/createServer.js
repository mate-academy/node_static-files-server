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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error! Path to file should start with `/file/`');

      return;
    }

    if (reqPath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');

      return;
    }

    const rel = reqPath.replace(/^\/file\/?/, '') || 'index.html';

    const normalized = path.normalize(rel);
    const absPath = path.resolve(publicDir, normalized);

    if (absPath !== publicDir && !absPath.startsWith(publicDir + path.sep)) {
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
        res.end(data);
      }
    });
  });

  return server;
}

module.exports = { createServer };
