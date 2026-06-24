'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const hint = 'Please specify a file path after /file/.';

function createServer() {
  return http.createServer((req, res) => {
    if (req.url.includes('//')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('URL is not correct');

      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const { pathname } = url;

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.setHeader('Content-type', 'text/plain');
      res.end(hint);

      return;
    }

    if (pathname === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      res.end(hint);

      return;
    }

    const relativePath = pathname.replace(/^\/file\/?/, '');
    const filePath = relativePath || 'index.html';
    const finalPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.resolve(__dirname, '../public');

    const ext = path.extname(filePath);

    if (!finalPath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad request');
    }

    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.txt': 'text/plain',
      '.js': 'application/javascript',
      '.json': 'application/json',
    };

    if (!fs.existsSync(finalPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;

      res.end('Not found');

      return;
    }

    res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
    res.statusCode = 200;

    const fileStream = fs.createReadStream(finalPath);

    fileStream.pipe(res);

    fileStream.on('error', () => {
      res.statusCode = 404;
      res.end('Not found');
    });

    res.on('close', () => {
      fileStream.destroy();
    });
  });
}

module.exports = {
  createServer,
};
