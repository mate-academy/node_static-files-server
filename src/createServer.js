'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const TEXT_PLAIN = { 'Content-Type': 'text/plain' };

function send(res, status, message) {
  res.writeHead(status, TEXT_PLAIN);
  res.end(message);
}

function createServer() {
  return http.createServer((req, res) => {
    const url = req.url;

    if (url === '/file') {
      send(res, 200, 'Use /file/<path> to load files');

      return;
    }

    if (!url.startsWith('/file/')) {
      send(res, 400, 'Invalid path');

      return;
    }

    const relativePath = url.slice('/file/'.length);

    if (relativePath.includes('//')) {
      send(res, 404, 'File not found');

      return;
    }

    const resolvedPath = path.resolve(PUBLIC_DIR, relativePath);

    if (!resolvedPath.startsWith(PUBLIC_DIR)) {
      send(res, 400, 'Invalid path');

      return;
    }

    fs.readFile(resolvedPath, (err, data) => {
      if (err) {
        send(res, 404, 'File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
}

module.exports = { createServer };
