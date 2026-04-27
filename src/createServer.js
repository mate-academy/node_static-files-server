'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function sendText(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
}

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const { pathname } = url;

    if (pathname.includes('//')) {
      return sendText(res, 404, 'Not found');
    }

    if (pathname === '/file') {
      return sendText(res, 200, `Use /file/<path>`);
    }

    if (!pathname.startsWith('/file/')) {
      return sendText(res, 400, 'Bad request');
    }

    const filePath = pathname.replace('/file/', '') || 'index.html';
    const realPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.resolve(__dirname, '../public');

    if (!realPath.startsWith(publicDir)) {
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
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
