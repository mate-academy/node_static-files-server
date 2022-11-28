'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (!(req.url.startsWith('/file') || req.url === '/')) {
    res.write('the path should start with "/file/"');
  }

  const normalizedURL = new url.URL(
    req.url.slice(6) || 'index.html',
    `http://${req.headers.host}`
  );

  const fileName = normalizedURL.pathname;

  fs.readFile(
    path.join(__dirname, `/../public${fileName}`),
    'utf8',
    (err, data) => {
      if (!err) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end();
      }
    }
  );
});

server.listen(PORT);
