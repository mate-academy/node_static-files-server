'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = normalizedUrl;

    if (!pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Hint: use /file/ to get file\n');

      return;
    }

    if (/\/{2,}/.test(pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Hint: use single slash / to get file\n');

      return;
    }

    const filePath = pathname.replace('/file', '') || 'index.html';
    const fullPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.join(__dirname, '../public');

    if (!fullPath.startsWith(publicDir)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use correct file path\n');

      return;
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found\n');

        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
