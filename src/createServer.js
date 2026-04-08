'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function createServer() {
  return http.createServer((req, res) => {
    const pathname = req.url.split('?')[0];

    // 🚫 duplicated slashes
    if (pathname.startsWith('/file/') && pathname.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');

      return;
    }

    // ℹ️ hint ONLY for /file
    if (pathname === '/file') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hint: load files using /file/<path-to-file>');

      return;
    }

    // 🚫 everything else outside /file/
    if (!pathname.startsWith('/file/')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    let relativePath = pathname.slice('/file/'.length);

    if (!relativePath) {
      relativePath = 'index.html';
    }

    const filePath = path.join(PUBLIC_DIR, relativePath);
    const resolvedPublic = path.resolve(PUBLIC_DIR);
    const resolvedFile = path.resolve(filePath);

    // 🚫 traversal protection (filesystem-level)
    if (!resolvedFile.startsWith(resolvedPublic + path.sep)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');

      return;
    }

    fs.stat(resolvedFile, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');

        return;
      }

      res.writeHead(200);
      fs.createReadStream(resolvedFile).pipe(res);
    });
  });
}

module.exports = {
  createServer,
};
