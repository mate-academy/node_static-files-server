'use strict';

const http = require('node:http');
const fsp = require('fs/promises');
const url = require('url');
const path = require('node:path');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
    const { pathname } = normalizedURL;
    const publicDir = path.resolve(__dirname, 'public');

    const filePath = path.join(
      publicDir,
      pathname.slice(6).trim() || 'index.html',
    );

    if (!filePath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.end('Traversal path');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Hint: Use the "/file/{filename}" path to load a file.');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('There are duplicate slashes!');

      return;
    }

    try {
      const file = await fsp.readFile(filePath, 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
