'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end('Go out');
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Not corrected path');
    }

    const fileName =
      normalizedUrl.pathname.replace('/file', '') || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;

        return res.end(data);
      }

      res.statusCode = 404;
      res.end('No file');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
