'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const fileName =
      normalizedUrl.pathname.replace('/file', '').slice(1) || 'index.html';

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Please, start your path with <file>');

      return;
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Path having duplicated slashes');

      return;
    }

    fs.readFile(`./public/${fileName}`, 'utf8', (err, data) => {
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
