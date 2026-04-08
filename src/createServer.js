/* eslint-disable max-len */
'use strict';

const http = require('node:http');
const fsp = require('node:fs/promises');
const path = require('node:path');

function createServer() {
  const getContentType = (ext) => {
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
    };

    return types[ext] || 'text/plain';
  };

  return http.createServer(async (req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = url;

    const publicDir = path.resolve('public');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      res.end(
        'To load files, use paths starting with /file/, e.g., /file/index.html',
      );

      return;
    }

    if (pathname === '/file') {
      const filePath = path.resolve(publicDir, 'index.html');

      if (!filePath.startsWith(publicDir + path.sep)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end('Bad Request');

        return;
      }

      try {
        const data = await fsp.readFile(filePath);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      }

      return;
    }

    if (pathname.startsWith('/file/')) {
      let requestedPath = pathname.replace('/file/', '');

      if (!requestedPath || requestedPath === '/') {
        requestedPath = 'index.html';
      }

      const filePath = path.resolve(publicDir, requestedPath);

      if (!filePath.startsWith(publicDir + path.sep)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');

        return;
      }

      try {
        const data = await fsp.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = getContentType(ext);

        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
      } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      }
    }
  });
}

module.exports = { createServer };
