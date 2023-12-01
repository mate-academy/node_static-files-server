'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((res, req) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

  if (!normalizedUrl.pathname.includes('/file')) {
    res.end('You should provide path to the file after `/file/`');
  }

  let [,, filePath] = normalizedUrl.pathname.split('/file');

  if (filePath === '' || filePath === '/') {
    filePath = '/index.html';
  }

  fs.readFile(`./public${filePath}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

module.exports = server;
