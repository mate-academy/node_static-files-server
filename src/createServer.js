'use strict';

const http = require('node:http');
const path = require('path');
const fs = require('fs');

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

const getContentType = (filePath) => {
  const extname = path.extname(filePath).toLowerCase();

  return CONTENT_TYPES[extname] || 'application/octet-stream';
};

const sendErrorResponse = (res, code, message) => {
  res.statusCode = code;
  res.end(message);
};

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname.includes('//')) {
      return sendErrorResponse(
        res,
        404,
        'Double slashes are not allowed in the URL.',
      );
    }

    if (pathname === '/file/' || pathname === '/file') {
      return sendErrorResponse(
        res,
        200,
        'Path should start with /file/. Correct path is: "/file/<FILE_NAME>".',
      );
    }

    if (!pathname.startsWith('/file/')) {
      return sendErrorResponse(
        res,
        400,
        'Request should not contain traversal paths.',
      );
    }

    const fileName = pathname.replace('/file/', '') || 'index.html';

    const publicPath = path.resolve(__dirname, '..', 'public');
    const filePath = path.resolve(publicPath, fileName);

    if (!filePath.startsWith(publicPath) || pathname.includes('..')) {
      return sendErrorResponse(res, 400, 'Path traversal detected.');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return sendErrorResponse(res, 404, 'File was not found.');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', getContentType(filePath));
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
