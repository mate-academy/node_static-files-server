'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs/promises');

function createServer() {
  return http.createServer(async (req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-type', 'text/plain');
      res.end('File not found');

      return;
    }

    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad request');
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const { pathname } = url;

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      res.end('Use /file/pathToFile to load the file');

      return;
    }

    const filePath = pathname.replace('/file', '') || 'index.html';
    const finalPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.resolve(__dirname, '../public');

    if (!finalPath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad request');
    }

    try {
      const content = await fs.readFile(finalPath);

      res.statusCode = 200;
      res.end(content);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-type', 'text/plain');
      res.end('File not found');
    }
  });
}

module.exports = {
  createServer,
};
