'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:5701';

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('content-type', 'text/plain');
    const { pathname } = new URL(req.url, BASE);
    const realPath = path.join(__dirname, '..', 'public', pathname.slice(5));

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Route must start with /file/');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Duplicated shashes error!');

      return;
    }

    if (req.url.slice(1, 6) !== 'file/') {
      res.statusCode = 200;
      res.end('Path should start with /file');

      return;
    }

    try {
      const file = fs.readFileSync(realPath, 'utf-8');

      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.end('No such a file!');
    }
  });
}

module.exports = {
  createServer,
};
