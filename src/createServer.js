'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const urlObj = new URL(req.url, 'http://localhost:5700');

    if (urlObj.pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('invalid path');

      return;
    }

    const publicDir = path.resolve('public');
    const requestedFile = urlObj.pathname.replace(/^\/file\/?/, '');
    const absolutePathfor = path.resolve(publicDir, requestedFile);

    if (!absolutePathfor.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('bad request');

      return;
    }

    if (urlObj.pathname === '/file' || urlObj.pathname === '/file/') {
      const indexPath = path.join('public', 'index.html');

      try {
        const file = fs.readFileSync(indexPath);

        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;
        res.end(file);

        return;
      } catch {
        res.statusCode = 404;
        res.end('dfdf');

        return;
      }
    }

    if (urlObj.pathname.startsWith('/file/')) {
      const indexPath = urlObj.pathname
        .split('/')
        .filter(Boolean)
        .slice(1)
        .join('/');
      const absolutePath = path.join('public', indexPath);

      try {
        const fil = fs.readFileSync(absolutePath);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(fil);
      } catch {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('must be starts with /file');
      }
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Welcome! To load a file, use /file/yourfilename');
    }
  });
}

module.exports = {
  createServer,
};
