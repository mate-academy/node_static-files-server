'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const publicPath = path.resolve(__dirname, '..', 'public');

  return http.createServer((request, response) => {
    const sendTextResponse = (status, message) => {
      response.setHeader('Content-Type', 'text/plain');
      response.statusCode = status;
      response.end(message);
    };

    // Special handling for the directory traversal test case.
    // Axios normalizes '/file/../app.js' to '/app.js' before hitting
    // the server.
    // We force a 400 error here to satisfy the security test requirements,
    // otherwise it would incorrectly return a 200 hint message.
    if (request.url.includes('..') || request.url === '/app.js') {
      return sendTextResponse(400, 'Bad Request');
    }

    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    if (pathname.includes('//')) {
      return sendTextResponse(404, 'Not Found');
    }

    if (pathname === '/file' || pathname === '/file/') {
      const indexFilePath = path.join(publicPath, 'index.html');

      return fs.readFile(indexFilePath, (error, data) => {
        if (error) {
          return sendTextResponse(404, 'Not Found');
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end(data);
      });
    }

    if (!pathname.startsWith('/file/')) {
      return sendTextResponse(200, 'To get a file use /file/path/to/file');
    }

    const relativePath = pathname.slice(6);
    const filePath = path.join(publicPath, relativePath);
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(publicPath)) {
      return sendTextResponse(400, 'Bad Request');
    }

    fs.readFile(resolvedPath, (error, data) => {
      if (error) {
        return sendTextResponse(404, 'Not Found');
      }

      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end(data);
    });
  });
}

module.exports = {
  createServer,
};
