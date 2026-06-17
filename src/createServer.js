'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const { pathname } = normalizedUrl;
    const fileName = pathname.replace('/file', '') || 'index.html';

    if (!pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use /file/{fileName} to access files');

      return;
    }

    if (pathname.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('"//" are not allowed');

      return;
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);

        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });
  });
}

module.exports = {
  createServer,
};
