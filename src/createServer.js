'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;

      res.end('Invalid request: request must start'
        + ' with "/file/" + directory or file path');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('"//" not supported.');

      return;
    }

    let fileName = pathname.replace('/file', 'public');

    if (fileName === 'public' || fileName === 'public/') {
      fileName = 'public/index.html';
    }

    fs.readFile(fileName, 'utf8', (error, data) => {
      if (error) {
        res.statusCode = 404;
        res.end(`${fileName} not found.`);

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
