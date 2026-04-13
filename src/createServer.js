'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  return MIME_TYPES[ext] || 'application/octet-stream';
}

function createServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);
    const { pathname } = url;

    if (pathname.includes('//')) {
      response.statusCode = 404;
      response.setHeader('Content-type', 'text/plain');
      response.end('Path cannot contain double slashes');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      response.statusCode = 200;
      response.setHeader('Content-type', 'text/plain');

      response.end(
        `To load files, use the path starting with /file/. For example: /file/index.html`,
      );

      return;
    }

    const relativePath = pathname.replace(/^\/file\/?/, '') || 'index.html';
    const publicDir = path.resolve(__dirname, '../public');
    const resolved = path.resolve(publicDir, relativePath);

    if (!resolved.startsWith(publicDir + path.sep)) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');

      return response.end('Cannot access files outside public folder');
    }

    try {
      const fileData = await fs.readFile(resolved);
      const contentType = getContentType(resolved);

      response.statusCode = 200;
      response.setHeader('Content-Type', contentType);
      response.end(fileData);
    } catch (error) {
      response.statusCode = 404;
      response.setHeader('Content-type', 'text/plain');
      response.end('File not found');
    }
  });
}

module.exports = {
  createServer,
};
