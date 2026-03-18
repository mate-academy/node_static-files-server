'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const protectedUrl = new URL(req.url, `http://${req.headers.host}`);
    const url = protectedUrl.pathname;

    if (url === '/file' || url === '/file/') {
      const indexFilePath = path.join(__dirname, '../public/index.html');

      fs.readFile(indexFilePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');

          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      });

      return;
    }

    if (!url.startsWith('/file/')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad Request');

      return;
    }

    const relativePath = url.slice(6);

    if (relativePath.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad Request');

      return;
    }

    if (relativePath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    const filePath = path.join(__dirname, '../public', relativePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
