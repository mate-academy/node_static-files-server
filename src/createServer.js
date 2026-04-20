'use strict';

const http = require('http');
const fs = require('fs');

function sendResponse(res, statusCode, contentType, message) {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(message);
}

function handleFileRequest(res, fileName) {
  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      return sendResponse(res, 404, 'text/plain', '404 Not Found');
    }

    sendResponse(res, 200, 'text/plain', data);
  });
}

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname.includes('//')) {
      return sendResponse(res, 404, 'text/plain', '404 Not Found');
    }

    if (!pathname.startsWith('/file')) {
      return sendResponse(
        res,
        400,
        'text/plain',
        'To load files, use the path /file/{filename}',
      );
    }

    const fileName = pathname.startsWith('/file/')
      ? pathname.replace('/file/', '')
      : 'index.html';

    handleFileRequest(res, fileName);
  });
}

module.exports = {
  createServer,
};
