'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs/promises');

function sendMessage(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const rawUrl = req.url;
    let decodedRaw;

    try {
      decodedRaw = decodeURIComponent(rawUrl);
    } catch (e) {
      decodedRaw = rawUrl;
    }

    const hasDotDotRaw = rawUrl.includes('..') || decodedRaw.includes('../');
    const hasEncodedDotDot = /%2e%2e/i.test(rawUrl);

    const isDuplicatedSlashes = rawUrl.includes('//');

    if (hasDotDotRaw || hasEncodedDotDot) {
      return sendMessage(res, 400, 'Bad Request');
    }

    if (isDuplicatedSlashes) {
      return sendMessage(res, 404, 'Not found');
    }

    if (pathname === '/file') {
      return sendMessage(res, 200, 'Incorrect path, use /file/<fileName>');
    }

    if (!pathname.startsWith('/file/')) {
      return sendMessage(res, 400, 'Bad request');
    }

    const filePath = pathname.replace('/file/', '') || 'index.html';
    const realPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.resolve(__dirname, '../public');

    if (!realPath.startsWith(publicDir)) {
      return sendMessage(res, 400, 'Bad Request');
    }

    try {
      const file = await fs.readFile(realPath);

      if (realPath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (realPath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }
      res.statusCode = 200;
      res.end(file);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
