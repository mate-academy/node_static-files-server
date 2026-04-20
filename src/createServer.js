'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    const normalizedPathWay = pathname.startsWith('/file')
      ? pathname.slice(5) || 'index.html'
      : pathname || 'index.html';

    const pathToFile = path.join(__dirname, '..', 'public', normalizedPathWay);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Routes not starting with /file/');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Path having duplicated slashes');

      return;
    }

    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Non-existent file');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
