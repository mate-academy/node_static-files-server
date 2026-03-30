/* eslint-disable no-console */
'use strict';

const http = require('http');
const path = require('path');
const fsp = require('fs/promises');

function createServer() {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Not Found');

      return;
    }

    const pathname = req.url.slice(1);

    const [action, ...rest] = pathname.split('/');
    const fileName = rest.join('/') || 'index.html';

    if (action !== 'file') {
      res.statusCode = 400;

      res.end('To load file, you need use "/file/fileName"');

      return;
    }

    if (!fileName) {
      res.statusCode = 200;

      res.end('Enter the correct path');

      return;
    }

    const realPath = path.join(__dirname, '..', 'public', fileName);

    try {
      const file = await fsp.readFile(realPath, 'utf-8');

      res.statusCode = 200;
      res.end(file);
    } catch (error) {
      res.statusCode = 404;

      res.end('Not Found');
    }
  });

  return server;
}

module.exports = { createServer };
