'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const PREFIX = '/file';

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname.includes('//')) {
      res.writeHead(404, 'Not Found', { 'Content-type': 'text/plain' });

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    if (!pathname.startsWith(PREFIX)) {
      res.writeHead(400, 'Bad request', { 'Content-type': 'text/plain' });

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    const fileName = path.join(
      'public',
      pathname === PREFIX || pathname === `${PREFIX}/`
        ? 'index.html'
        : pathname.replace(PREFIX, ''),
    );

    fs.readFile(fileName, (err, data) => {
      if (err) {
        res.writeHead(404, 'Not Found', { 'Content-type': 'text/plain' });
        res.end(`404 Not Found`);

        return;
      }

      res.writeHead(200, 'OK', { 'Content-type': 'text/plain' });
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
