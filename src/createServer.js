'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const url = req.url;

    if (url === '/file') {
      return res.end('bla');
    }

    if (!url.startsWith('/file/')) {
      res.statusCode = 400;

      return res.end('HINT: routes not starting with "/file/"');
    }

    if (url.includes('//')) {
      res.statusCode = 404;
      res.end('No doubleSlash allowed');

      return;
    }

    const fileName = url.replace('file/', '') || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
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
