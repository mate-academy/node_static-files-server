'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    const { url } = req;
    const publicPathPrefix = '/file';
    const pathname = url;

    let relativeFilePath;

    if (pathname === publicPathPrefix || pathname === `${publicPathPrefix}/`) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      relativeFilePath = 'index.html';
    } else if (pathname.startsWith(`${publicPathPrefix}/`)) {
      relativeFilePath = pathname.substring(publicPathPrefix.length + 1);
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      res.end(
        'Invalid file request. Files must be requested via /file/path/to/file.',
      );

      return;
    }

    const publicDir = path.resolve(__dirname, '..', 'public');
    let filePath = relativeFilePath;

    if (filePath === '' || filePath === '/') {
      filePath = 'index.html';
    }

    if (filePath.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    if (filePath.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    const fullPath = path.join(publicDir, filePath);

    if (!fullPath.startsWith(publicDir)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
