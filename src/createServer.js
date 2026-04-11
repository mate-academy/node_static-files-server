'use strict';

const fs = require('fs');
const http = require('http');

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
    const myPathName = myUrl.pathname || 'index.html';

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

    if (myPathName.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');

      return;
    }

    const cleanPartName = myPathName
      .replace(/\.\.\//g, '')
      .replace(/file/g, '');

    fs.readFile(`./public/${cleanPartName}`, (err, data) => {
      if (!err) {
        res.writeHead(200, {
          'Content-Type': `${contentType(cleanPartName)}`,
        });
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
