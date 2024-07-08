'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    res.statusMessage = 'OK';

    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const fileName = `public/${normalizedUrl.pathname.slice(6)}`;

    if (
      normalizedUrl.pathname === '/' ||
      !normalizedUrl.pathname.startsWith('/file/')
    ) {
      res.end('Please, start your path with <file>');

      return;
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Path having duplicated slashes');

      return;
    }

    if (fileName.includes('..')) {
      res.statusCode = 400;
      res.end('Traversal paths are not allowed');

      return;
    }

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (!err) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('File does not exist');
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
