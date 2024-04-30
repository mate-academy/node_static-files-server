'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const fileName = pathname.replace('/file/', '') || 'index.html';

    if (pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Double slashes are not allowed in the URL.');
    }

    if (pathname === '/file/' || pathname === '/file') {
      res.statusCode = 200;

      return res.end(
        'Path should start with /file/. Correct path is: "/file/<FILE_NAME>".',
      );
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;

      return res.end('Request should not contain traversal paths.');
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;

        return res.end(data);
      }

      res.statusCode = 404;

      return res.end('File was not found.');
    });
  });
}

module.exports = {
  createServer,
};
