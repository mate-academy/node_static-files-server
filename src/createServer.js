'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

function createServer() {
  const publicFolderPath = path.resolve(__dirname, '../public');

  const server = http.createServer((req, res) => {
    const rawUrl = req.url || '';

    // pathname without the query string
    const requestPath = rawUrl.split('?')[0];

    let decodedPathname = requestPath;

    try {
      // decode the pathname, so we can handle special characters
      decodedPathname = decodeURIComponent(requestPath);
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid file path');

      return;
    }

    // check if the pathname contains '..' to prevent traversal
    if (rawUrl.includes('..') || decodedPathname.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid file path');

      return;
    }

    if (!decodedPathname.startsWith('/file/')) {
      if (path.extname(decodedPathname)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid file path');

        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Invalid path. To load files, use: /file/filename');

      return;
    }

    const requestedFile = decodedPathname.replace(/^\/file\//, '');
    const pathSegments = requestedFile.split('/');

    if (pathSegments.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid file path');

      return;
    }

    if (pathSegments.some((segment) => segment.length === 0)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');

      return;
    }

    const filePath = path.resolve(publicFolderPath, requestedFile);

    if (!filePath.startsWith(`${publicFolderPath}${path.sep}`)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid file path');

      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');

        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
