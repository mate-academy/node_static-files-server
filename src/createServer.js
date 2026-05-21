'use strict';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost');

    const pathname = parsedUrl.pathname;

    if (pathname === '/file') {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.end('Use /file/{filename} to load a file');

      return;
    }

    if (pathname.includes('//')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
      res.end('Pathnames cannot contain duplicated slashes');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;
      res.statusMessage = 'Bad Request';
      res.end('Only /file/{filename} is allowed');

      return;
    }

    let requestedFile = pathname.slice(6);

    if (requestedFile === '') {
      requestedFile = 'index.html';
    }

    const filePath = path.join(__dirname, '../public', requestedFile);

    if (!fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
      res.end('File not found');

      return;
    }

    const extension = path.extname(filePath);

    res.setHeader(
      'Content-Type',
      extension === '.css' ? 'text/css' : 'text/html',
    );

    const fileContent = fs.readFileSync(filePath);

    res.statusCode = 200;
    res.statusMessage = 'OK';

    res.end(fileContent);
  });
}

module.exports = {
  createServer,
};
