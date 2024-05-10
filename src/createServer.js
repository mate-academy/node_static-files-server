/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');

    const { pathname } = new URL(`http://${req.headers.host}${req.url}`);

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Correct request is: "/file/<PATH_TO_THE_FILE>".');

      return;
    }

    if (pathname.indexOf('//') !== -1) {
      res.statusCode = 404;
      res.end('Check the path. There should be no duplicate slashes.');

      return;
    }

    let fileName = pathname.slice(1).replace('file/', '');

    if (pathname === '/file/' || pathname === '/file') {
      fileName = 'index.html';
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('no such file or directory');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
