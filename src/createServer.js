'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Double "//" not supported.');

      return;
    }

    if (pathname !== '/file' && !pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To get a file use path /file/FILENAME');

      return;
    }

    const filePath = pathname.slice('/file/'.length);

    if (!filePath) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To get a file use path /file/FILENAME');

      return;
    }

    const publicDir = path.resolve(process.cwd(), 'public');
    const fullPath = path.normalize(path.join(publicDir, filePath));

    if (!fullPath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Access denied');

      return;
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });

  return server;
}

module.exports = { createServer };
