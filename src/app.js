'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (!req.url.startsWith('/file')) {
    res.end('pathname should start with `/file`');

    return;
  }

  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const fileName = normalizedUrl.pathname
    .replace(/\/file\/*/, '') || 'index.html';
  const filePath = path.join(__dirname, 'public', fileName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(3000);
