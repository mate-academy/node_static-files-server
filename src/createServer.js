'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

/* eslint-disable max-len */
const HINT_MESSAGE =
  'To load a file, use a path like /file/<FILE_NAME>, for example /file/index.html';
/* eslint-enable max-len */
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME_TYPES = { '.html': 'text/html', '.css': 'text/css' };

function createServer() {
  const server = http.createServer((req, res) => {
    const pathname = req.url.split('?')[0];

    if (pathname === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      res.end(HINT_MESSAGE);

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      res.end(HINT_MESSAGE);

      return;
    }

    if (pathname.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Path traversal is not allowed');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      res.end('File not found');

      return;
    }

    const fileName = pathname.slice('/file/'.length) || 'index.html';
    const filePath = path.join(PUBLIC_DIR, fileName);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');

        res.end('File not found');

        return;
      }

      const contentType = MIME_TYPES[path.extname(filePath)] || 'text/plain';

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);

      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
