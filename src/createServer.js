'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const receivedUrl = () => {
      const fullPref = '/file/';

      if (req.url.includes(fullPref)) {
        return req.url.slice(req.url.indexOf(fullPref) + fullPref.length);
      }

      return '';
    };

    res.setHeader('Content-Type', 'text/plain');

    if (!req.url.includes('/file') || req.url.includes('//')) {
      if (!req.url.includes('/file')) {
        res.statusCode = 400;
      } else {
        res.statusCode = 404;
      }
      res.end();

      return;
    }

    if (!req.url.includes('/file/')) {
      res.statusCode = 200;
      res.end(`Route should start with '/file'`);

      return;
    }

    const filePath = receivedUrl() || 'index.html';
    const normalizedUrl = path.join(__dirname, '..', 'public', filePath);

    try {
      const file = fs.readFileSync(normalizedUrl, 'utf-8');

      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.statusMessage = 'Not found';
      res.end('Not found');
    }
  });
}

module.exports = {
  createServer,
};
