'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const myUrl = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-type', 'text/plain');

    if (myUrl.pathname.includes('//')) {
      res.statusCode = 404;

      res.end('Error: Duplicate slashes not supported');

      return;
    }

    if (myUrl.pathname === '/file') {
      res.statusCode = 200;

      res.end('Hint: pathname must be /file/fileName');

      return;
    }

    if (!myUrl.pathname.startsWith('/file/')) {
      res.statusCode = 400;

      res.end('Hint: pathname must be /file/fileName');

      return;
    }

    const pathname = myUrl.pathname.replace('/file/', '') || 'index.html';

    fs.readFile(`./public/${pathname}`, (err, data) => {
      if (err) {
        res.statusCode = 404;

        return res.end('Error: No such file or directory');
      }

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
