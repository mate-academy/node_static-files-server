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

    if (request.url.includes('..')) {
      response.statusCode = 404;
      response.end('/../ not allowed');
      // I have no idea how to pass this test:
      // 'should return 400 for traversal paths'
      // maybe axios normalizes the path and prevents traversal paths?
    }

    if (!request.url.startsWith('/file/')) {
      response.statusCode = 200;
      // the tests demands that this status code is 200
      // not sure if it's correct since this is not a successful response
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
