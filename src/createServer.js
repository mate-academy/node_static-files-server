/* eslint-disable no-console */
'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    console.log(req.url);

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (req.url.includes('..')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Do not try to cheat');

      return;
    }

    const requestPath = pathname.replace('/file', '') || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestPath);

    if (!(pathname === '/file' || pathname.startsWith('/file/'))) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Request url should start with /file/');

      return;
    }

    if (!fs.existsSync(realPath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('No such file');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Duplicate slashes not allowed');

      return;
    }

    try {
      const file = fs.readFileSync(realPath);

      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end(file);
    } catch {
      res.end();
    }
  });

  return server;
}

module.exports = {
  createServer,
};
