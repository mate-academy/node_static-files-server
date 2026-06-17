/* eslint-disable no-shadow */
'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Use /file/yourfilename to load files from the public folder');

      return;
    }

    let requestedPath = url.pathname.slice('/file/'.length);

    if (requestedPath === '') {
      requestedPath = 'index.html';
    }

    if (requestedPath.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Bad Request');

      return;
    }

    if (requestedPath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    const publicDir = path.resolve(__dirname, '..', 'public');
    const realPath = path.resolve(publicDir, requestedPath);

    if (!realPath.startsWith(publicDir + path.sep)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Bad Request');

      return;
    }

    try {
      const textFileExtensions = [
        '.html',
        '.htm',
        '.css',
        '.js',
        '.json',
        '.txt',
      ];
      const ext = path.extname(realPath).toLowerCase();
      const isTextFile = textFileExtensions.includes(ext);

      const file = fs.readFileSync(realPath, isTextFile ? 'utf-8' : null);

      let contentType = 'application/octet-stream';

      switch (ext) {
        case '.html':
        case '.htm':
          contentType = 'text/html; charset=utf-8';
          break;
        case '.css':
          contentType = 'text/css; charset=utf-8';
          break;
        case '.js':
          contentType = 'application/javascript; charset=utf-8';
          break;
        case '.json':
          contentType = 'application/json; charset=utf-8';
          break;
        case '.txt':
          contentType = 'text/plain; charset=utf-8';
          break;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
}

module.exports = {
  createServer,
};
