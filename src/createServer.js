'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.end();

      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = url;

    res.setHeader('Content-Type', 'text/plain');

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    if (!pathname.startsWith('/file')) {
      res.statusCode = 200;
      res.end('Pathname should start with "/file".');

      return;
    }

    const parts = pathname
      .split('/')
      .filter((part) => part !== '' && part !== 'file');

    const filePath = !parts.length
      ? 'public/index.html'
      : `public/${parts.join('/')}`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found.');

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
