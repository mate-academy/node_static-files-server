'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const fileName = pathname.split('/file')[1];

    if (fileName === '') {
      res.end('Too short url');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Should not have duplicated slashes');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.end('Should started with /file/');

      return;
    }

    try {
      const data = fs.readFileSync(`./public${fileName}`);

      res.end(data);
    } catch (err) {
      res.statusCode = 404;

      res.end('File is not exist');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
