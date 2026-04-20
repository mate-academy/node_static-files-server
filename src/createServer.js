'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const fileName = pathname.replace('/file/', '') || 'index.html';

    if (pathname === '/file/' || pathname === '/file') {
      res.statusCode = 200;

      res.end('To access files, use paths that start with /file/');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;

      res.end('Double "//" not supported.');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;

      return res.end('Access forbidden: path traversal detected.');
    }

    const publicDir = path.join(__dirname, '..', 'public');
    const realPath = path.join(publicDir, fileName);

    fs.readFile(realPath, (err, data) => {
      if (!err) {
        res.statusCode = 200;

        return res.end(data);
      }

      res.statusCode = 404;

      return res.end('File doesnt exist');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
