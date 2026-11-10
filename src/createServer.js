'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.url.includes('../')) {
      res.setHeader('Content-type', 'text/plain');
      res.statusCode = 400;
      res.end('Wrong address');

      return;
    }

    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
    const reqPart = normalizedURL.href.replace(normalizedURL.origin, '');

    if (!reqPart.includes('/file/')) {
      res.setHeader('Content-type', 'text/plain');
      res.end('To access file use /file/ path');

      return;
    }

    if (reqPart.includes('//')) {
      res.setHeader('Content-type', 'text/plain');
      res.statusCode = 404;
      res.end('Not Found');

      return;
    }

    const filePath = `./public/${reqPart.replace('/file/', '').length ? reqPart.replace('/file/', '').length : 'index.html'}`;

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const fileSplit = filePath.slice('.');
      const fileType = fileSplit[fileSplit.length - 1];

      res.setHeader('Content-type', `text/${fileType}`);
      res.end(data);
    } catch {
      res.setHeader('Content-type', 'text/plain');
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
