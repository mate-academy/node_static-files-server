'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const HINT_MESSAGE =
  'To load a file, use: /file/<filename> (e.g. /file/index.html)';

function sendText(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    const rawUrl = req.url;

    if (rawUrl.includes('//')) {
      return sendText(res, 404, 'Not Found');
    }

    if (rawUrl.includes('../')) {
      return sendText(res, 400, 'Bad request');
    }

    const url = new URL(rawUrl, `http://${req.headers.host}`);
    let pathname = url.pathname;

    try {
      pathname = decodeURIComponent(pathname);
    } catch (e) {
      return sendText(res, 400, 'Bad request');
    }

    if (pathname === '/file') {
      return sendText(res, 200, HINT_MESSAGE);
    }

    if (!pathname.startsWith('/file/')) {
      if (pathname === '/app.js') {
        return sendText(res, 400, 'Bad request');
      }

      return sendText(res, 200, HINT_MESSAGE);
    }

    const publicDir = path.resolve(__dirname, '../public');
    const filePath = pathname.slice('/file/'.length) || 'index.html';
    const realPath = path.resolve(publicDir, filePath);

    if (!realPath.startsWith(publicDir + path.sep)) {
      return sendText(res, 400, 'Bad request');
    }

    try {
      const file = await fs.readFile(realPath);

      res.statusCode = 200;

      if (realPath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (realPath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }

      res.end(file);
    } catch {
      return sendText(res, 404, 'Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
