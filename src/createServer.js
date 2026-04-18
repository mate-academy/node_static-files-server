/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  errors: 'text/plain',
  hint: 'text/plain',
};

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, 'http://localhost:5700');
    const pathname = normalizedUrl.pathname;

    if (pathname === '/file') {
      res.writeHead(200, 'OK', {
        'Content-Type': CONTENT_TYPES.hint,
      });
      res.end('Use /file/<filename> to load files');

      return;
    }

    if (pathname.includes('//')) {
      res.writeHead(404, 'Bad Request', {
        'Content-Type': CONTENT_TYPES.errors,
      });
      res.end('Incorect path');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.writeHead(200, 'OK', {
        'Content-Type': CONTENT_TYPES.hint,
      });
      res.end('Use /file/<filename> to load files');

      return;
    }

    const filePath = path.join('public', pathname.replace('/file/', ''));

    if (!filePath.startsWith('public')) {
      res.writeHead(400, 'Bad Request', {
        'Content-Type': CONTENT_TYPES.errors,
      });
      res.end('Attempt to access files outside public folder');

      return;
    }

    fs.readFile(filePath, (err, data) => {
      const existent = path.extname(filePath);

      if (err) {
        res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
        res.end('File not found');

        return;
      }

      res.writeHead(200, 'OK', {
        'Content-Type': CONTENT_TYPES[existent],
      });
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
