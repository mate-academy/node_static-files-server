/* eslint-disable no-console */
'use strict';

const http = require('http');
const path = require('path');
const fsp = require('fs/promises');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const MIME_TYPES = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    };

    if (req.url.includes('//')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('Not Found');

      return;
    }

    const pathname = req.url.slice(1);

    const [action, ...rest] = pathname.split('/');
    const fileName = rest.join('/');

    if (action !== 'file') {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;

      res.end('To load file, you need use "/file/fileName"');

      return;
    }

    if (!fileName) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end('To load file, you need use "/file/fileName"');

      return;
    }

    const realPath = path.join(__dirname, '..', 'public', fileName);

    try {
      const file = await fsp.readFile(realPath, 'utf-8');

      const ext = path.extname(fileName);
      const contentType = MIME_TYPES[ext] || 'text/plain';

      res.setHeader('Content-Type', contentType);

      res.statusCode = 200;
      res.end(file);
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;

      res.end('Not Found');
    }
  });

  return server;
}

module.exports = { createServer };
