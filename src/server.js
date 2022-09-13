'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const BASE_PATHNAME = '/file';

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  const pathname = normalizedURL.pathname;
  const localPath = pathname.slice(BASE_PATHNAME.length + 1) || 'index.html';

  if (!pathname.startsWith(BASE_PATHNAME)) {
    res.statusCode = 404;
    res.end('All public files can be found by /file endpoint');
  }

  fs.readFile(`./public/${localPath}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('No such file');
    }

    res.end(data);
  });
});

module.exports = server;
