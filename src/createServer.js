'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const FILELIKE_EXTS = new Set(Object.keys(MIME_TYPES));

function send(res, statusCode, body, contentType = 'text/plain') {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(body);
}

function createServer() {
  return http.createServer((req, res) => {
    const rawUrl = req.url || '';
    const rawPath = rawUrl.split('?')[0];

    if (!rawPath.startsWith('/file/')) {
      const ext = path.extname(rawPath).toLowerCase();

      if (FILELIKE_EXTS.has(ext)) {
        send(res, 400, 'Bad Request');

        return;
      }

      send(
        res,
        200,
        'Use /file/<path> to load static files from public folder',
      );

      return;
    }

    const relRaw = rawPath.slice('/file/'.length);

    if (relRaw.includes('//')) {
      send(res, 404, 'Not Found');

      return;
    }

    let relDecoded;

    try {
      relDecoded = relRaw ? decodeURIComponent(relRaw) : 'index.html';
    } catch {
      send(res, 400, 'Bad Request');

      return;
    }

    const filePath = path.resolve(PUBLIC_DIR, relDecoded);
    const relToPublic = path.relative(PUBLIC_DIR, filePath);

    if (relToPublic.startsWith('..') || path.isAbsolute(relToPublic)) {
      send(res, 400, 'Bad Request');

      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        send(res, 404, 'Not Found');

        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);

      fs.createReadStream(filePath)
        .on('error', () => send(res, 404, 'Not Found'))
        .pipe(res);
    });
  });
}

module.exports = {
  createServer,
};
