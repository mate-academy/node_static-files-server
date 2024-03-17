/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-type', 'text/plain');

    if (pathname === '/file') {
      return res.end('Pathname must be /file/fileName');
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;

      return res.end('Pathname must be /file/fileName');
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Error: Duplicate slashes not supported');
    }

    const path = pathname.replace('/file', '') || 'index.html';

    fs.readFile(`./public${path}`, (err, data) => {
      if (err) {
        res.statusCode = 404;

        return res.end('Error: No such file or directory');
      }

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
