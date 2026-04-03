'use strict';
/* eslint-disable no-console */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const mimeTypes = {
  '.html': 'text/html',
  '.htm': 'text/html',
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

// ; charset=utf-8

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  return mimeTypes[ext] || 'application/octet-stream';
}

function readFile(pathToFile, res, contentType = 'text/plain') {
  fs.readFile(pathToFile, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
      } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Server error');
      }

      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost:5701');

    if (pathname === '/favicon.ico') {
      res.statusCode = 204;
      res.setHeader('Content-Type', 'text/plain');
      res.end();

      return;
    }

    const decodedPath = decodeURIComponent(pathname);

    if (decodedPath.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad Request');

      return;
    }

    if (pathname === '/file' || pathname === '/file/') {
      const pathTopublicDir = path.normalize(
        path.join(__dirname, '..', 'public') + path.sep,
      );
      const newPath = path.join(pathTopublicDir, 'index.html');

      readFile(newPath, res, 'text/plain');

      return;
    }

    if (!pathname.startsWith('/file')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To upload a file, use the path /file/<file_name>');

      return;
    }

    const requested = pathname.replace(/^\/file/, '').replace(/^\/+/, '');

    const publicDir = path.normalize(
      path.join(__dirname, '..', 'public') + path.sep,
    );

    const fullPath = path.normalize(path.join(publicDir, requested));

    if (!fullPath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    readFile(fullPath, res, getContentType(fullPath));
  });

  return server;
}

module.exports = {
  createServer,
};
