'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = normalizedUrl.pathname;

    res.setHeader('Content-type', 'text/plain');

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('To load files, use the /file/ path');

      return;
    }

    if (pathname === '/file') {
      res.statusCode = 200;
      res.end('To load files, use the /file/ path');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.end('To load files, use the /file/ path');

      return;
    }

    const fileName = pathname.replace('/file/', '') || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end("Such file doesn't exist");
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
