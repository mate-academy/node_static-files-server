'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-type', 'text/plain');

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Hint: pathname must be `/file/fileName`');

      return;
    }

    if (pathname === '/file') {
      res.statusCode = 200;
      res.end('Hint: pathname must start with `/file/`');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.end('Hint: pathname must be `/file/fileName`');

      return;
    }

    const parts = pathname.replace('/file/', '') || 'index.html';

    fs.readFile(`./public/${parts}`, 'utf-8', (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('No such file');
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
