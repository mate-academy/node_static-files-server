'use strict';

const http = require('http');
const fs = require('fs');

function staticFilesServer() {
  const server = http.createServer((request, response) => {
    const path = request.url;

    if (path === '/favicon.ico') {
      response.statusCode = 204;
      response.end();

      return;
    }

    if (!path.startsWith('/file')) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'text/plain');
      response.end('Invalid url. Please enter /file/...');

      return;
    }

    const requestPath = path.slice('/file/'.length);
    const filePath = './public/' + requestPath;

    try {
      const file = fs.readFileSync(filePath);

      response.setHeader('Content-Type', 'application/octet-stream');
      response.end(file);
    } catch (error) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.end('File not found');
    }
  });

  return server;
}

module.exports = { staticFilesServer };
