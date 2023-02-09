'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  let fileName = '';

  if (normalizedURL.pathname.startsWith('/file')) {
    fileName = normalizedURL.pathname.slice(6) || 'index.html';
  } else {
    res.end('Wrong pathname. Correct request is: "/file/<FILE_NAME>"');
  }

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT);
