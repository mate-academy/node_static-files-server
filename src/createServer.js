'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    if (req.url.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');

      return;
    }

    const parseUrl = new URL(req.url, 'http://localhost:5701');
    const requestPath = parseUrl.pathname;

    if (!requestPath.startsWith('/file/') && requestPath !== '/file') {
      const isLikelyTraversal =
        requestPath !== '/' && !requestPath.startsWith('/file');

      res.writeHead(isLikelyTraversal ? 400 : 200, {
        'Content-Type': 'text/plain',
      });
      res.end('Hint: you should use /file/ prefix');

      return;
    }

    const pathToFile = requestPath.slice(6) || 'index.html';
    const publicDir = path.join(__dirname, '..', 'public');
    const filePath = path.join(publicDir, pathToFile);

    if (!filePath.startsWith(publicDir)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Directory traversal is not allowed');

      return;
    }

    try {
      const content = await fs.readFile(filePath);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(content);
    } catch (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  });
}

module.exports = {
  createServer,
};
