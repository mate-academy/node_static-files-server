'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(`http://${req.headers.host}${req.url}`);

    const requestedPath =
      pathname.replace('/file', '').slice(1) || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    res.setHeader('content-type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('access denied!');
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Do not use double slashes for the path');
    }

    fs.readFile(realPath, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('File not found');
    });
  });
}

module.exports = {
  createServer,
};
