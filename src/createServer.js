'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    res.setHeader('Content-type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end(
        'Hint: download file from public dir, ' +
          'using a part of the path after /file/',
      );
    }

    let filePath = pathname.slice('/file'.length);

    if (filePath === '' || filePath === '/') {
      filePath = '/index.html';
    }

    const resolvedPath = path.resolve(publicDir + filePath);

    if (!resolvedPath.startsWith(publicDir)) {
      res.statusCode = 404;

      return res.end('Not Found');
    }

    if (!fs.existsSync(resolvedPath)) {
      res.statusCode = 404;

      return res.end('Not Found');
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;

      return res.end('Do not use double slash');
    }

    if (req.url.includes('..')) {
      res.statusCode = 400;

      return res.end('Access denied');
    }

    fs.readFile(resolvedPath, 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
