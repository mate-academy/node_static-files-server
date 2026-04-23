'use strict';
/* eslint-disable no-console */

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 5701;
const baseUrl = `http://localhost:${PORT}`;

const createServer = () => {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new url.URL(req.url, baseUrl);

    const fileName = normalizedUrl.pathname.slice(6) || 'index.html';

    console.log(normalizedUrl);
    console.log(fileName);

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Route must start with /file/');

      return;
    }

    if (normalizedUrl.pathname.slice(1, 6) !== 'file/') {
      res.statusCode = 200;
      res.end('Path should start with /file');

      return;
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Path cannot contain "//"');

      return;
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('404 Not Found');
      }
    });
  });
};

module.exports = {
  createServer,
};
