'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/plain');

    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Correct request is: "/file/<File_NAME>"');

      return;
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const fileName =
      normalizedUrl.pathname.replace('/file', '').slice(1) || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('File not found');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
