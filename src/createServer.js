'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const publicPath = path.resolve(__dirname, '..', 'public');

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
};

const createServer = () => {
  const server = http.createServer((req, res) => {
    const [pathname] = req.url.split('?');

    res.setHeader('Content-Type', 'text/plain');

    if (pathname.includes('../')) {
      res.statusCode = 400;
      res.end('Bad request');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Not found');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('Use /file/<filename> to load a file');

      return;
    }

    const relativePath = pathname.slice('/file/'.length) || 'index.html';
    const filePath = path.resolve(publicPath, relativePath);

    if (!filePath.startsWith(publicPath + path.sep)) {
      res.statusCode = 400;
      res.end('Bad request');

      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');

        return;
      }

      const extension = path.extname(filePath);

      res.statusCode = 200;
      res.setHeader('Content-Type', contentTypes[extension] || 'text/plain');
      res.end(data);
    });
  });

  return server;
};

module.exports = { createServer };
