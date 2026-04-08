'use strict';

const http = require('node:http');
const path = require('node:path');
const fsp = require('node:fs/promises');

const mimeType = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

function createServer() {
  return http.createServer(async (req, res) => {
    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Forbidden');
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Use /file/<path> to load files');

      return;
    }

    const requestPath = url.pathname.replace(/^\/file\/?/, '') || 'index.html';

    if (requestPath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not Found');
    }

    const basePath = path.resolve(__dirname, '..', 'public');
    const pathToFile = path.resolve(basePath, requestPath);

    if (!pathToFile.startsWith(basePath + path.sep)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.statusMessage = 'Forbidden';
      res.end('Forbidden');

      return;
    }

    try {
      const checkFile = await fsp.stat(pathToFile);

      if (!checkFile.isFile()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.statusMessage = 'Not Found';
        res.end('Not a file');

        return;
      }
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.statusMessage = 'Not Found';
      res.end('File not found');

      return;
    }

    const ext = path.extname(pathToFile).toLowerCase();
    const contentType = mimeType[ext] || 'text/plain';

    try {
      const file = await fsp.readFile(pathToFile);

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.statusMessage = 'OK';
      res.end(file);
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.statusMessage = 'Server Problem';
      res.end();
    }
  });
}

module.exports = {
  createServer,
};
