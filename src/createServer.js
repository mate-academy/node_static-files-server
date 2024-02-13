/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const PUBLIC_DIR = 'public';
  const FILE_PATH = '/file/';
  const INDEX = 'index.html';

  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(
      req.url,
      `http://${req.headers.host}`
    );

    if (!pathname.startsWith(FILE_PATH)) {
      res.statusCode = 200;
      res.end('Invalid request. Please start your path with "/file/"');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const pathParts = pathname.split('/')
      .filter(part => !!part)
      .slice(1);

    if (!pathParts.length) {
      pathParts.push(INDEX);
    }

    const filePath = pathname.slice(FILE_PATH.length) || INDEX;

    fs.readFile(`./${PUBLIC_DIR}/${filePath}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
      }

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
