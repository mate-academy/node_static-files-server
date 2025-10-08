'use strict';

const http = require('http');
const fsp = require('fs/promises');
const path = require('path');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const requestedPath =
      pathname === '/file' || pathname === '/file/'
        ? 'index.html'
        : pathname.replace(/^\/file\/?/, '');
    const decodePath = decodeURIComponent(requestedPath);
    const normaliredPath = path.normalize(decodePath);

    if (
      !(
        pathname === '/file' ||
        pathname === '/file/' ||
        pathname.startsWith('/file/')
      )
    ) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Use /file/<filename> to load files');

      return;
    }

    const publicPath = path.resolve(__dirname, '..', 'public');
    const finalPath = path.resolve(publicPath, normaliredPath);

    const rel = path.relative(publicPath, finalPath);

    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not Found');
    }

    if (/\/{2,}/.test(requestedPath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not Found');
    }

    try {
      const file = await fsp.readFile(finalPath);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(file);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
