'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.statusMessage = 'Path should start with "/file/"';
      res.end();
    } else {
      const requestedPath =
        normalizedUrl.pathname === '/file' ||
        normalizedUrl.pathname === '/file/'
          ? 'index.html'
          : normalizedUrl.pathname.slice(6);

      if (requestedPath.includes('//')) {
        res.statusCode = 404;
        res.statusMessage = 'File path should not include double-slash';
        res.end('File path should not include double-slash');
      }

      fs.readFile(`./public/${requestedPath}`, (err, data) => {
        if (!err) {
          res.statusCode = 200;
          res.end(data);
        } else {
          res.statusCode = 404;
          res.statusMessage = 'File is not existing';
          res.end('File not found');
        }
      });
    }
  });
}

module.exports = {
  createServer,
};
