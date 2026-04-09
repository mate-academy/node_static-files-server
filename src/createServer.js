'use strict';

const http = require('node:http');
const fsp = require('node:fs/promises');
const path = require('node:path');

const publicDir = path.resolve(__dirname, '../public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
};

function getContentType(filePath) {
  return MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname } = url;

    // duplicated slashes
    if (pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Double slashes are prohibited!');
    }

    // only /file routes
    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Use /file/pathToFile to load the file');
    }

    let relativePath;

    // /file or /file/
    if (pathname === '/file' || pathname === '/file/') {
      relativePath = 'index.html';
    } else {
      relativePath = pathname.replace('/file/', '');
    }

    const finalPath = path.resolve(publicDir, relativePath);

    // traversal protection
    if (!finalPath.startsWith(publicDir)) {
      res.statusCode = 400;

      return res.end('Access denied!');
    }

    try {
      const file = await fsp.readFile(finalPath, 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', getContentType(finalPath));
      res.end(file);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });
}

module.exports = { createServer };
