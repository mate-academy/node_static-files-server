'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const normalizedPathName = pathname.replace('/file', '') || 'index.html';
    const pathToFile = path.join(__dirname, '..', 'public', normalizedPathName);

    res.setHeader('content-type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Routes not starting with /file/');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Paths having duplicated slashes');

      return;
    }

    fs.readFile(pathToFile, 'utf-8', (err, file) => {
      if (err) {
        res.statusCode = 404;
        res.end('Non-existent files');

        return;
      }

      res.statusCode = 200;
      res.end(file);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
