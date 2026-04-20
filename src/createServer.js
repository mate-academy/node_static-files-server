'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5701;
const HOSTNAME = 'http://localhost';
const BASE = `${HOSTNAME}:${PORT}`;
const rootDir = __dirname.split('\\').slice(0, -1).join('/');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedPathname = new URL(req.url, BASE).pathname;

    if (!normalizedPathname.includes('file')) {
      res.statusCode = 400;
      res.end();

      return;
    }

    if (normalizedPathname.includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    let requestedPath = path.join(
      rootDir,
      normalizedPathname.replace('file', 'public'),
    );

    if (requestedPath.endsWith('public')) {
      requestedPath += '/index.html';
    }

    fs.readFile(requestedPath, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('Miss');
    });
  });

  return server;
}

module.exports = {
  createServer,
  BASE,
};
