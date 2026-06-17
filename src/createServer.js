'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const pathname = req.url;
    let normalizedPath = pathname.replace('/file', '');

    if (normalizedPath.length > 0) {
      normalizedPath = path.join(__dirname, '..', 'public', normalizedPath);
    } else {
      normalizedPath = 'public/index.html';
    }

    res.setHeader('content-type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Routes not starting with /file/');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Paths having duplicated slashes');
    }

    fs.readFile(normalizedPath, 'utf-8', (err, file) => {
      if (err) {
        res.statusCode = 404;
        res.end('Non-existent files');

        return;
      }

      res.statusCode = 200;
      res.end(file);
    });
  });
}

module.exports = {
  createServer,
};
