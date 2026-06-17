'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class

  const server = http.createServer((req, res) => {
    fs.readFile(
      `./public/${req.url.replace('/file', '') || 'index.html'}`,
      (err, data) => {
        res.setHeader('Content-Type', 'text/plain');

        if (req.url.includes('//')) {
          res.statusCode = 404;
          res.end('Please dont use duplicated slashes');

          return;
        }

        if (!req.url.startsWith('/file')) {
          res.statusCode = 400;
          res.end('Please provide a path starting with /file/');

          return;
        }

        if (err) {
          res.statusCode = 404;
          res.end('File not found');

          return;
        }

        res.end(data);
      },
    );
  });

  return server;
}

module.exports = { createServer };
