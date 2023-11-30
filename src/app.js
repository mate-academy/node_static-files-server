'use strict';

const http = require('http');
const fs = require('fs');
const STATUS_OK = 200;
const STATUS_WRONG_REQUEST = 404;

const createServer = () => {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (!normalizedUrl.pathname.startsWith('/file/')) {
      res.writeHead(STATUS_OK, { 'Content-Type': 'text/plain' });
      res.end('Hint: Load files using /file/ path');

      return;
    }

    const fileName = normalizedUrl.pathname.slice(6) || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = STATUS_OK;
        res.end(data);
      } else {
        res.statusCode = STATUS_WRONG_REQUEST;
        res.end('File not found');
      }
    });
  });

  return server;
};

module.exports = {
  createServer,
};
