'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const fileName = url.pathname.replace('/file/', '') || 'index.html';

    res.setHeader('Content-Type', 'text/plain');

    if (url.pathname.includes('//')) {
      res.statusCode = 404;
      res.end(`pathname must be http://${req.headers.host}/file/fileName`);

      return;
    }

    if (url.pathname === '/file') {
      res.statusCode = 200;
      res.end(`pathname must be http://${req.headers.host}/file/fileName`);

      return;
    }

    if (!url.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end(`pathname must start with '/file/'`);

      return;
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('File not found');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
