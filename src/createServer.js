'use strict';

const http = require('http');
const url = require('url');
const PORT = 5701;
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const fileName =
      normalizedUrl.pathname.replace('/file', '').slice(1) || `index.html`;

    res.setHeader('Content-Type', 'text/plain');

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Correct request is: "/file/<File_NAME>"');

      return;
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('File not found');
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
  PORT,
};
