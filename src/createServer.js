'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedURL = new URL(req.url || '', `http://${req.headers.host}`);
    const normalizedPathName =
      normalizedURL.pathname.replace('/file', '') || 'index.html';

    const pathToFile = path.join(__dirname, '..', 'public', normalizedPathName);

    res.setHeader('content-type', 'text/plain');

    if (!normalizedURL.pathname.startsWith('/file')) {
      res.statusCode = 400;

      res.end(
        'Invalid request. Use the URL format /file/<FILENAME> to upload files',
      );

      return;
    }

    if (normalizedURL.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Error. This path should not have two slashes');

      return;
    }

    if (!fs.existsSync(`./public/${normalizedPathName}`)) {
      res.statusCode = 404;
      res.end('This file does not exist');

      return;
    }

    try {
      const file = fs.readFileSync(pathToFile, 'utf-8');

      res.statusCode = 200;
      res.end(file);
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
