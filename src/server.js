'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const pathname = normalizedURL.pathname;

  if (!pathname.startsWith('/file/')) {
    res.writeHead(400, 'Bad request');
    res.end('Please enter valid file path, e.g. "/file/index.html"');
  }

  const pathSegments = normalizedURL.pathname.split('/file/');
  const fileName = pathSegments[pathSegments.length - 1];

  const folderPath = './../public/';

  fs.readFile(folderPath + fileName, 'utf8', (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.writeHead(404, 'Bad request');
    res.end();
  });
});

module.exports = { server };
