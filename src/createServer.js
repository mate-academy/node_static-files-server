'use strict';

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    const { pathname } = new URL(`http://${req.headers.host}${req.url}`);
    const requestedPath =
      pathname.replace('/file', '').slice(1) || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Access denied!');
      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Do not use double slashes for the path');
      return;
    }

    try {
      const data = await fs.readFile(realPath);
      res.statusCode = 200;
      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.end('File not found');
    }
  });
}

module.exports = {
  createServer,
};
