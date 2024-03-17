'use strict';

const http = require('http');
const fs = require('fs');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');

    if (req.url.includes('//')) {
      res.statusCode = NOT_FOUND;
      res.end('Path must be `/file/fileName`');

      return;
    }

    if (req.url === '/file') {
      res.statusCode = OK;
      res.end('Path must be `/file/fileName`');

      return;
    }

    if (!req.url.startsWith('/file/')) {
      res.statusCode = BAD_REQUEST;
      res.end('Path must be `/file/fileName`');

      return;
    }

    const filePath =
      req.url !== '/file/'
        ? req.url.replace('/file/', './public/')
        : 'index.html';

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = NOT_FOUND;
        res.end('Does not exist');

        return;
      }

      res.statusCode = OK;
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
