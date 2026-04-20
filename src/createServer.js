'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/file') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Use /file/<filename> to load files.');

      return;
    }

    if (!req.url.startsWith('/file/')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid path. Use /file/<filename> to load files.');

      return;
    }

    const relativePath =
      req.url.replace('/file/', '').replace(/\/+/g, '/') || 'index.html';
    const filePath = path.resolve(__dirname, '../public', relativePath);

    const publicDir = path.resolve(__dirname, '../public');

    if (
      !filePath.startsWith(publicDir) ||
      filePath.includes('../') ||
      req.url.includes('//')
    ) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found.');

      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found.');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error reading file.');
        }

        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
