/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    const urlUse = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = urlUse.pathname;

    res.setHeader('Content-Type', 'text/plain');

    console.log('\nSTART', pathname);

    if (req.url.includes('//')) {
      res.statusCode = 404;

      return res.end('Double slashes are prohibited!');
    }

    if (req.url.includes('..')) {
      res.statusCode = 400;

      return res.end('Access denied!');
    }

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end(
        'Hint: to download a file from public dir, use /file/ prefix',
      );
    }

    let filePath = pathname.slice('/file'.length);

    if (filePath === '' || filePath === '/') {
      filePath = '/index.html';
    }

    const finalPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.resolve(__dirname, '../public');

    if (!finalPath.startsWith(publicDir)) {
      res.statusCode = 400;

      return res.end(
        'Hint: to download a file from public dir, use /file/ prefix',
      );
    }

    fs.readFile(finalPath, 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 404;

        res.end('File not found');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = { createServer };
