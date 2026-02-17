'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = normalizedUrl;

    if (pathname.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');

      return;
    }

    if (!pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Should be /file/*');

      return;
    }

    const relativeFilePath = pathname.replace(/^\/file\/?/, '');

    if (!relativeFilePath) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');

      return;
    }

    fs.readFile(`public/${relativeFilePath}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found');

        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
