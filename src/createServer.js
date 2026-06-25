'use strict';

const http = require('http');
const path = require('path');
const fsp = require('fs/promises');

function createServer() {
  const server = http.createServer(async (req, res) => {
    if (req.url && req.url.includes('../')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad request');

      return;
    }

    const parsedUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const { pathname } = parsedUrl;

    if (pathname.slice(0, 6) !== '/file/') {
      if (!pathname.startsWith('/file') && pathname !== '/') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad request');

        return;
      }

      res.setHeader('Content-Type', 'text/plain');
      res.end('To load files use /file/filename');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    const requestedPath = pathname.slice(6) || 'index.html';
    const realPath = path.join('public', requestedPath);

    try {
      const file = await fsp.readFile(realPath, 'utf8');

      res.statusCode = 200;

      if (requestedPath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
      } else if (requestedPath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }

      res.statusCode = 200;
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
