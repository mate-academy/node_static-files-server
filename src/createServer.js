'use strict';

const http = require('http');
const path = require('path');
const fsPromises = require('fs').promises;

function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.statusMessage = 'Path should start with "/file/"';
      res.end();

      return;
    }

    const requestedPath = url.pathname.slice(6) || 'index.html';

    if (requestedPath.includes('//')) {
      res.statusCode = 404;
      res.statusMessage = 'Invalid file path: double slashes are not allowed.';
      res.end();

      return;
    }

    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    try {
      const file = await fsPromises.readFile(realPath, 'utf8');

      res.statusCode = 200;
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.end('404 Not found');
    }
  });
}

module.exports = {
  createServer,
};
