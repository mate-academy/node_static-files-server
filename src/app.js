'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  const startPage = '/index.html';

  if (!normalizedURL.pathname.startsWith('/file')) {
    res.end('path name does not start with "/file"');
  }

  let fileName = normalizedURL.pathname
    .replace('/file', '') || startPage;

  if (fileName === '/') {
    fileName = startPage;
  }

  fs.readFile(`./public${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {});
