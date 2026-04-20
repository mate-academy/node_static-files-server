'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end('Correct request: "/file/<filename>"');
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Path should not contain double slashes');
    }

    let fileName = pathname.replace('/file/', '');

    if (pathname === '/file/' || pathname === '/file') {
      fileName = 'index.html';
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.statusCode = 404;

        return res.end('No such file');
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
