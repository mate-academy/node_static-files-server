'use strict';

const path = require('path');
const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    if ((req.url || '').includes('..')) {
      res.statusCode = 400;
      res.end('Attempt to access files outside public folder');

      return;
    }

    if ((req.url || '').includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === '/file/' || pathname === '/file') {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end('You write incorrect path, correct path: /file/fileName');

      return;
    }

    const publicPath = path.join(__dirname, '..', 'public');

    const filePath = pathname.replace('/file/', '');
    const realPath = path.resolve(publicPath, filePath);

    if (!realPath.startsWith(publicPath)) {
      res.statusCode = 400;
      res.end('Attempt to access files outside public folder');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Attempt to access files outside public folder');

      return;
    }

    try {
      const file = fs.readFileSync(realPath, 'utf-8');

      const fileName = path.basename(realPath);
      const ext = fileName.includes('.') ? fileName.split('.').pop() : null;

      res.statusCode = 200;
      res.setHeader('Content-Type', ext ? `text/${ext}` : 'text/plain');
      res.end(file);
    } catch (e) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
