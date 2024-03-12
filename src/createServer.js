'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.statusCode = 200;

    if (!req.url.includes('/file')) {
      res.statusCode = 400;
      res.end('Not attempt to access files outside public folder');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    const pathParts = normalizedUrl.pathname.slice(1).split('/');

    if (pathParts[0] === 'file') {
      const filePath = pathParts.length > 1
        ? pathParts.slice(1).join('/')
        : 'index.html';

      fs.readFile(`public/${filePath}`, (err, data) => {
        if (!err) {
          res.end(data);

          return;
        }

        res.statusCode = 404;
        res.end('No such file');
      });
    } else {
      res.end('Path should start with /file');
    }
  });
}

module.exports = {
  createServer,
};
