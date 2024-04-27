'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedURL = new url.URL(req.url, 'http://localhost:5701');
    const pathname = normalizedURL.pathname;

    // eslint-disable-next-line no-console
    console.log(req.path, pathname);

    if (req.url.includes('/../')) {
      res.statusCode = 400;
      res.end();

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;

      return res.end(
        'should return 400 for traversal paths'
          + 'hint message for routes not starting with /file/"',
      );
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Pathname cant contain //');

      return;
    }

    const filePath = pathname.slice(6);

    fs.readFile(
      `./public/${filePath}`,
      'utf-8',
      (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');

          res.end(err.message);

          return;
        }

        res.end(data);
      });
  });

  return server;
}

module.exports = {
  createServer,
};
