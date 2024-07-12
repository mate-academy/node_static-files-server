'use strict';

const { readFile } = require('fs');
const http = require('http');

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.url !== '/favicon.ico') {
      const path = req.url.slice(1).split('/');

      const { pathname } = new URL(`http://${req.headers.host}${req.url}`);

      res.setHeader('Content-Type', 'text/plain');

      if (pathname.includes('//')) {
        res.statusCode = 404;
        res.end('No double slashes');

        return;
      }

      if (!pathname.startsWith('/file')) {
        res.statusCode = 400;
        res.end('You should have /file/ in your path');

        return;
      }

      if (
        req.url.slice(1).split('/')[0] === 'file' &&
        req.url.slice(1).split('/').length === 1
      ) {
        res.statusCode = 200;
        res.end('You should have /file/ in your path');

        return;
      }

      const currentPathname =
        './public/' + path.filter((item) => item !== 'file').join('/');

      readFile(currentPathname, (err, data) => {
        if (!err) {
          res.statusCode = 200;
          res.end(data);

          return;
        }

        res.statusCode = 404;
        res.end('No file with such name');
      });
    }
  });

  return server;
}

module.exports = {
  createServer,
};
