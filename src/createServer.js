'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const PUBLIC_DIR = path.join(__dirname, '../public');

  return http.createServer((req, res) => {
    const { url } = req;

    if (!url.startsWith('/file/')) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('Use /file/{fileName} to access files');
    }

    let requestedPath = decodeURIComponent(url.replace('/file/', ''));
    requestedPath = requestedPath.replace(/\/{2,}/g, '/')
    const normalizedPath = path.normalize(requestedPath);

    if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Bad Request');
    }

    const filePath = path.join(PUBLIC_DIR, normalizedPath);

    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Bad Request');
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('File not found');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Internal Server Error');
        }

        res.writeHead(200);
        res.end(data);
      });
    });
  });
}

module.exports = {
  createServer,
};
