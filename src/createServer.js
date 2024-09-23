'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:5701';

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');
    res.statusCode = 200;

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Duplicated shashes error!');

      return;
    }

    const normalizedUrl = new URL(req.url, BASE);
    const pathURL = normalizedUrl.pathname.slice(1);

    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.end('Don`t even try');

      return;
    }

    if (req.url.slice(1, 6) !== 'file/') {
      res.statusCode = 200;
      res.end('Path should start with /file');

      return;
    }

    const realPath = path.join(__dirname, '..', 'public', pathURL.slice(4));

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
