'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

function contentType(url) {
  const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain',
  };

  for (const [key, value] of Object.entries(MIME_TYPES)) {
    if (url.endsWith(key)) {
      return value;
    }
  }

  return 'application/octet-stream';
}

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const myUrl = new URL(req.url, `http://${req.headers.host}`);
    const myPathName = myUrl.pathname;

    if (myPathName === '/file') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Please specify a file path after /file/.');

      return;
    }

    if (!myPathName.startsWith('/file/')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use /file/<path> to load files');

      return;
    }

    const relativePath =
      myUrl.pathname.replace(/^\/file\/?/, '') || 'index.html';
    const publicDir = path.resolve(__dirname, '..', 'public');
    const fullPath = path.resolve(publicDir, relativePath);

    if (!fullPath.startsWith(publicDir + path.sep) && fullPath !== publicDir) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');

      return;
    }

    try {
      const data = fs.readFileSync(fullPath);
      const contentTypes = contentType(fullPath);

      res.writeHead(200, { 'Content-Type': contentTypes });
      res.end(data);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
