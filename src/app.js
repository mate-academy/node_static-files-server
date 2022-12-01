'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (!(url.pathname.startsWith('/file') || req.url === '/')) {
    res.end('the path should start with "/file/"');

    return;
  }

  const fileName = url.pathname.slice(6) || 'index.html';
  const filePath = path.resolve('public', fileName);

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('File does not exist');

    return;
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Something went wrong');

      return;
    }

    res.end(data);
  });
});

server.listen(PORT);
