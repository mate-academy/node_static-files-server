'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.url.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end();

      return;
    }

    if (req.url.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end();

      return;
    }

    if (req.url.includes('/app.js')) {
      res.statusCode = 400;

      return res.end();
    }

    const { pathname } = new URL(
      req.url || '',
      `http://${req.headers.host || 'localhost'}`,
    );

    if (pathname === '/file' || !pathname.startsWith('/file/')) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('To load files use /file/filename');

      return;
    }

    const requestedPath =
      pathname.replace('/file', '').slice(1) || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    fs.readFile(realPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found');

        return;
      }

      let contentType = 'text/plain';

      if (realPath.endsWith('.html')) {
        contentType = 'text/html';
      } else if (realPath.endsWith('.css')) {
        contentType = 'text/css';
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
