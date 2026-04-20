'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Please remove duplicated slashes');

      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Please start your adress from /<FILE>');

      return;
    }

    const modifiedPath =
      url.pathname.replace('/file', '').slice(1) || 'index.html';

    const finalPath = path.join(__dirname, '..', 'public', modifiedPath);

    res.setHeader('Content-Type', 'text/plain');

    if (!fs.existsSync(finalPath)) {
      res.statusCode = 404;
      res.end('File does not exist');

      return;
    }

    try {
      const data = fs.readFileSync(finalPath, 'utf-8');

      res.statusCode = 200;
      res.end(data);
    } catch (error) {
      res.statusCode = 404;
      res.end();
    }
  });
}

module.exports = {
  createServer,
};
