'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const extMap = {
  '.html': 'text/html',
  '.css': 'text/css',
};

function createServer() {
  return http.createServer((request, response) => {
    const requestUrl = request.url;

    if (requestUrl.includes('../')) {
      response.statusCode = 400;
      response.setHeader('content-type', 'text/plain');

      response.end('Bad Request.');

      return;
    }

    if (requestUrl.includes('//')) {
      response.statusCode = 404;
      response.setHeader('content-type', 'text/plain');

      response.end('The pathname contains duplicated slashes.');

      return;
    }

    if (requestUrl === '/file') {
      response.statusCode = 200;
      response.setHeader('content-type', 'text/plain');

      response.end('Please provide a file name, e.g., /file/index.html');

      return;
    }

    if (requestUrl === '/file/') {
      response.statusCode = 200;

      const filePath = path.join(__dirname, '../public', 'index.html');
      const fileData = fs.readFileSync(filePath, 'utf-8');

      const headerKey = extMap[path.extname(filePath)] || 'text/plain';

      response.setHeader('content-type', headerKey);

      response.end(fileData);

      return;
    }

    if (!requestUrl.startsWith('/file/')) {
      response.statusCode = 200;
      response.setHeader('content-type', 'text/plain');

      response.end('File path should start with "/file/"');

      return;
    }

    try {
      const cleanPath = requestUrl.replace('/file/', '');

      const filePath = path.join(__dirname, '../public', cleanPath);
      const fileData = fs.readFileSync(filePath, 'utf-8');

      response.statusCode = 200;

      const headerKey = extMap[path.extname(filePath)] || 'text/plain';

      response.setHeader('content-type', headerKey);

      response.end(fileData);
    } catch {
      response.statusCode = 404;
      response.setHeader('content-type', 'text/plain');

      response.end('This file does not exist.');
    }
  });
}

module.exports = {
  createServer,
};
