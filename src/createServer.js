'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const normalizedPath = normalizedUrl.pathname;

    if (normalizedPath.length < 6 || !normalizedPath.startsWith('/file/')) {
      const message = 'Wrong request format '
      + 'Correct request is: "/file/<PATH_TO_FILE OR FILE NAME>".';

      res.statusCode = 400;
      res.end(message);
    } else {
      const fileName = normalizedUrl.pathname.replace('/file', '').slice(1)
      || 'index.html';

      fs.readFile(`./public/${fileName}`, (err, data) => {
        if (!err) {
          res.statusCode = 200;
          res.end(data);
        } else {
          res.statusCode = 404;
          res.end('Not found');
        }
      });
    }
  });

  return server;
}

module.exports = { createServer };
