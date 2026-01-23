'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs/promises');

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const { pathname } = url;

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-type', 'text/plain');
      res.end('File not found');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      res.end('Use /file/pathToFile to load the file');

      return;
    }

    let relativePath = pathname.replace('/file', '');

    if (relativePath === '/' || relativePath === '') {
      relativePath = 'index.html';
    }

    const publicDir = path.join(__dirname, '..', 'public');
    const safePath = path.join(publicDir, relativePath);

    if (!safePath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad request');

      return;
    }

    try {
      const content = await fs.readFile(safePath);

      res.statusCode = 200;
      res.end(content);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-type', 'text/plain');
      res.end('File not found');
    }
    // Return instance of http.Server class
  });
}

module.exports = {
  createServer,
};
