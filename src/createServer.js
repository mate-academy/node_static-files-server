'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PUBLIC_ROOT = path.resolve(process.cwd(), 'public');

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    // eslint-disable-next-line prefer-const
    let pathname = normalizedUrl.pathname;

    let relativeFilePath = '';
    const publicPathPrefix = '/file';

    if (pathname === publicPathPrefix || pathname === `${publicPathPrefix}/`) {
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

    const fullFilePath = path.resolve(PUBLIC_ROOT, relativeFilePath);

    if (!fullFilePath.startsWith(PUBLIC_ROOT)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');

      return;
    }

    fs.readFile(fullFilePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      res.statusCode = 200;

      res.setHeader('Content-Type', 'text/plain');

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
