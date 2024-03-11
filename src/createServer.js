/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (!req.url.includes('/file')) {
      res.statusCode = 400;
      res.end('Invalid request. Not allowed traversal paths');

      return;
    }

    if (!req.url.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('Invalid request. Please start your path with "/file/"');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const filename = normalizedUrl.pathname.slice('/file/'.length)
      || 'index.html';

    fs.readFile(`./public/${filename}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);
      } else {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 404;
          res.end('Internal Server Error');
        }
      }
    });
  });
}

module.exports = {
  createServer,
};
