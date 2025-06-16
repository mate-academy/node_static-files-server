/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Please delete duplicated slashes');

      return;
    }

    const normalizedURL = new url.URL(
      req.url || '',
      `http://${req.headers.host}`,
    );

    res.setHeader('Content-Type', 'text/plain');

    if (!normalizedURL.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Please, start your path with <file>');

      return;
    }

    const requestedPath =
      normalizedURL.pathname.replace('/file', '').slice(1) || 'index.html';

    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    if (!fs.existsSync(realPath)) {
      res.statusCode = 404;
      res.end("File doesn't exist");

      return;
    }

    try {
      const data = fs.readFileSync(realPath, 'utf8');

      res.statusCode = 200;
      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.end();
    }
  });

  return server;
}

module.exports = {
  createServer,
};
