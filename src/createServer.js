'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/file') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Please specify a file path after /file/.');

      return;
    }

    if (!url.pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use /file/<path> to load files');

      return;
    }

    const relativePath = url.pathname.replace(/^\/file\/?/, '') || 'index.html';
    const publicDir = path.resolve(__dirname, '..', 'public');
    const fullPath = path.resolve(publicDir, relativePath);

    if (!fullPath.startsWith(publicDir + path.sep) && fullPath !== publicDir) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');

      return;
    }

    try {
      const data = fs.readFileSync(fullPath);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
}

module.exports = {
  createServer,
};
