'use strict';

const http = require('http');
const fs = require('fs');
const mime = require('mime-types');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const initialUrl = url.pathname;
    const contentType = mime.lookup(initialUrl) || 'text/plain';

    res.setHeader('Content-Type', contentType);

    if (initialUrl === '/file') {
      res.statusCode = 200;
      res.end('Please provide a file path. Example: /file/example.txt');

      return;
    }

    if (!initialUrl.startsWith('/file') || initialUrl.includes('..')) {
      res.statusCode = 400;
      res.end('Invalid file path');

      return;
    }

    const pathToFile = `./public/${initialUrl.slice(1).replace('file/', '')}`;

    if (pathToFile.includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    fs.readFile(pathToFile, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('No such file or directory');

          return;
        }

        res.statusCode = 400;
        res.end();

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
