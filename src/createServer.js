'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const fullUrl = `http://${req.headers.host}${req.url}`;
    const givenUrl = new URL(fullUrl);
    const givenPath = givenUrl.pathname;

    if (!req.url.startsWith('/file/')) {
      res.setHeader('Content-Type', 'text/plain');
      res.end('Start your path with a /file');

      return;
    }

    const rightPath = givenPath.slice(6) || 'index.html';

    if (givenPath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Avoid duplicated slashes');

      return;
    }

    const fullRightPath = path.join(__dirname, '..', 'public', rightPath);
    const normalizedFullPath = path.normalize(fullRightPath);
    const publicDir = path.join(__dirname, '..', 'public');

    if (!normalizedFullPath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You cannot read files outside public folder!');

      return;
    }

    try {
      const file = fs.readFileSync(normalizedFullPath, 'utf-8');

      res.setHeader('Content-Type', 'text/html');
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
