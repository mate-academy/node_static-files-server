/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = require('./PORT');

function createServer() {
  return http.createServer((request, response) => {
    response.setHeader('Content-type', 'text/plain');

    if (request.url === '/favicon.ico') {
      return;
    }

    if (!request.url.startsWith('/file/')) {
      response.statusCode = 200;
      response.end('Pathname must start with `/file`');

      return;
    }

    const publicPath = path.resolve(__dirname, '..', 'public');
    const parsedUrl = request.url.replace('/file', '');
    const requestUrl = new URL(parsedUrl, `http://localhost:${PORT}`);
    const filePath = path.join(publicPath, requestUrl.pathname);

    try {
      const file = fs.readFileSync(filePath, 'utf-8');

      response.statusCode = 200;
      response.end(file);
    } catch (err) {
      response.statusCode = 404;
      response.end('File not found.');
    }
  });
}

module.exports = {
  createServer,
};
