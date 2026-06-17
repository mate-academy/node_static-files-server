'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLocaleLowerCase();
  const map = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
  };

  return map[ext] || 'application/octet-stream';
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath = url.pathname.replace(/^\/file\//, '');

    if (url.pathname === '/file/' || url.pathname === '/file') {
      filePath = 'index.html';
    }

    const safePath = path.join(__dirname, 'public', filePath);
    const resolvedPath = path.resolve(safePath);
    const publicPath = path.resolve(__dirname, 'public');

    if (!resolvedPath.startsWith(publicPath)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied');

      return;
    }

    if (!url.pathname.startsWith('/file/')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('To upload a file, use a path in the format /file/filename');

      return;
    }

    fs.access(resolvedPath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');

        return;
      }

      res.writeHead(200, {
        'Content-Type': getContentType(resolvedPath),
      });
      fs.createReadStream(resolvedPath).pipe(res);
    });
  });
}

module.exports = {
  createServer,
};
