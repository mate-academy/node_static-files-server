'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedURL = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = normalizedURL.pathname;

    res.setHeader('content-type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Invalid request. Use the URL format /file/<FILENAME>');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Error. This path should not have two slashes');

      return;
    }

    let filePath = pathname.slice('/file'.length);

    if (filePath === '' || filePath === '/') {
      filePath = '/index.html';
    }

    const fullPath = `./public${filePath}`;

    if (!fs.existsSync(fullPath)) {
      res.statusCode = 404;
      res.end('This file does not exist');

      return;
    }

    try {
      const fileContent = fs.readFileSync(fullPath);

      res.statusCode = 200;
      res.end(fileContent);
    } catch (err) {
      res.statusCode = 500;
      res.end('Server Error');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
