'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const hasRightStart = url.pathname.startsWith('/file');
  const trimmedPathname = url.pathname.slice(6);
  let pathname = '';

  if (hasRightStart) {
    pathname = `../public/${trimmedPathname || 'index.html'}`;
  } else {
    res.statusCode = 400;
    res.end('Invalid path. Correct request is: "/file/<FILE_NAME>"',);
  }

  fs.readFile(pathname, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT);
