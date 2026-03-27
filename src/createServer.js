'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = url.pathname;

    if (req.url.includes('..')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Invalid path');

      return;
    }

    if (pathname.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');

      return;
    }

    if (pathname === '/file' || pathname === '/file/') {
      pathname = '/file/index.html';
    }

    if (pathname.startsWith('/file/')) {
      fs.readFile(`.${pathname.replace('file', 'public')}`, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Please use /file/ prefix to load files');
    }
  });
}

module.exports = {
  createServer,
};
