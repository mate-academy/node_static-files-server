'use strict';

const fs = require('fs');
const http = require('http');

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const pathname = normalizedURL.pathname;

  if (!pathname.startsWith('/file')) {
    res.end('Enter correct path name!');
  }

  const fileName = pathname.split('/').slice(2).join('/') || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (!err) {
      res.statusCode = 200;
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT);
