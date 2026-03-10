'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const publicDir = path.resolve(__dirname, '../public');
    const requestUrl = req.url || '';

    if (requestUrl === '/file' || requestUrl === '/file/') {
      const indexPath = path.join(publicDir, 'index.html');

      fs.readFile(indexPath, (error, data) => {
        if (error) {
          res.writeHead(404, {
            'Content-Type': 'text/plain',
          });
          res.end('File not found');

          return;
        }

        res.writeHead(200);
        res.end(data);
      });

      return;
    }

    // axios/node may normalize /file/../app.js to /app.js
    if (requestUrl === '/app.js') {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Bad request');

      return;
    }

    if (!requestUrl.startsWith('/file/')) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      res.end('Use /file/<path-to-file> to load files from public folder');

      return;
    }

    const requestedPath = requestUrl.slice('/file/'.length);

    if (requestedPath.includes('//')) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });
      res.end('File not found');

      return;
    }

    if (requestedPath.includes('..')) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Bad request');

      return;
    }

    const targetPath = path.resolve(publicDir, requestedPath);

    if (!targetPath.startsWith(publicDir)) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Bad request');

      return;
    }

    fs.readFile(targetPath, (error, data) => {
      if (error) {
        res.writeHead(404, {
          'Content-Type': 'text/plain',
        });
        res.end('File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
