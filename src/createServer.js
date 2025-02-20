'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new url.URL(req.url, `http://${req.headers.host}`);
    const filename = pathname.replace('/file/', '') || 'index.html';

    res.setHeader('Content-Type', 'text/plain');

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Bad request. No double slashes allowed in the URL.');

      return;
    }

    if (pathname === '/file/' || pathname === '/file') {
      res.statusCode = 200;
      res.end('Correct pathname is /file/<filename>');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.end('Bad request. Valid path is /file/<filename>');

      return;
    }

    fs.readFile(`./public/${filename}`, (err, data) => {
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
