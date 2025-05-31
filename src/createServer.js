'use strict';

const http = require('http');
const fsp = require('fs/promises');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const normalizesUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = normalizesUrl.pathname;

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end('Invalid path. Use /file/<filename>');
    }

    const relativePath = pathname.slice(5) || '/index.html';
    const normalizedPath = path
      .normalize(relativePath)
      .replace(/^(\.\.[/\\])+/, '');
    const requestedFilePath = path.join(PUBLIC_DIR, normalizedPath);

    if (!requestedFilePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });

      return res.end('Access denied');
    }

    try {
      if (pathname.includes('//')) {
        throw new Error();
      }

      const fileContent = await fsp.readFile(requestedFilePath);

      res.statusCode = 200;
      res.end(fileContent);
    } catch (error) {
      res.statusCode = 404;
      res.end('Not found ERROR');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
