'use strict';

const http = require('http');
const fsp = require('fs/promises');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const START_PATH = '/file';

function createServer() {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url.includes('//')) {
      res.statusCode = 404;

      return res.end('Not found');
    }

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = normalizedUrl.pathname;

    if (!pathname.startsWith(START_PATH)) {
      res.statusCode = 400;

      return res.end(`Invalid path. Use $${START_PATH}/<filename>`);
    }

    const relativePath = pathname.slice(START_PATH.length) || '/index.html';

    try {
      const requestedPath = path.resolve(PUBLIC_DIR, '.' + relativePath);

      if (!requestedPath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 404;

        return res.end('Access denied');
      }

      const fileContent = await fsp.readFile(requestedPath);

      res.statusCode = 200;
      res.end(fileContent);
    } catch (error) {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
