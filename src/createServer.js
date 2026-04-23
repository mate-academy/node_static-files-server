'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    const BASE_URL = path.resolve(__dirname, '..', 'public');
    const url = new URL(req.url, 'http://localhost:5701');

    if (!url.pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });

      res.end(
        'Invalid request. To load a file, use the URL format: /file/<filename>',
      );

      return;
    }

    const requestedPath =
      url.pathname.replace(/^\/file\/?/, '') || 'index.html';
    const fullPath = path.resolve(BASE_URL, requestedPath);

    if (/\/{2,}/.test(url.pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Paths having duplicated slashes');

      return;
    }

    if (!fullPath.startsWith(BASE_URL)) {
      res.statusCode = 400;
      res.end('Traversal is not allowed');

      return;
    }

    try {
      await fs.access(fullPath, fs.constants.F_OK);
    } catch (notExistFile) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not exist');

      return;
    }

    try {
      const stats = await fs.stat(fullPath);

      if (!stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Target is not file');

        return;
      }
    } catch (notExistFile) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not exist');

      return;
    }

    try {
      const fileData = await fs.readFile(fullPath);

      res.writeHead(200, { 'Content-Type': `text/plain` });
      res.end(fileData);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Something went wrong');
    }
  });
}

module.exports = {
  createServer,
};
