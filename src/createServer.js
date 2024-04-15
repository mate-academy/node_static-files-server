'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const url = req.url;

    if (!url.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('You should provide the path, which starts with /file/');

      return;
    }

    if (url.includes('../')) {
      res.statusCode = 400;
      res.end('No dots allowed in the path');

      return;
    }

    if (url.includes('//')) {
      res.statusCode = 404;
      res.end('No doubleSlash allowed');

      return;
    }

    const fileName = url.replace(/\/*file\/?/, '');

    fs.readFile(`public/${fileName}`, (err, data) => {
      if (!err) {
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('Not Found');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
