'use strict';

const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const url = require('url');

const BASE_DIR = path.join(__dirname, '../public');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.txt': 'text/plain',
};

function createServer() {
  return http.createServer(async (req, res) => {
    const requestUrl = new url.URL(req.url, 'http://localhost');
    const pathname = requestUrl.pathname;

    if (pathname === '/file' || pathname === '/file/') {
      try {
        const filePath = path.join(BASE_DIR, 'index.html');
        const content = await fs.readFile(filePath);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      } catch {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');
      }

      return;
    }

    if (pathname.startsWith('/file/')) {
      const after = pathname.slice(6);

      if (after.includes('//')) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');

        return;
      }
    }

    const parts = pathname.split('/').filter(Boolean);

    if (parts[0] !== 'file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('The pathname must start with /file/');

      return;
    }

    let requestedPath = path.join(BASE_DIR, ...parts.slice(1));

    if (parts.length === 1) {
      requestedPath = path.join(BASE_DIR, 'index.html');
    }

    if (!requestedPath.startsWith(BASE_DIR)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad request');

      return;
    }

    try {
      const ext = path.extname(requestedPath);
      const type = mimeTypes[ext] || 'text/plain';
      const content = await fs.readFile(requestedPath);

      res.statusCode = 200;
      res.setHeader('Content-Type', type);
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');
    }
  });
}

module.exports = { createServer };
