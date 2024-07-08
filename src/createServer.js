'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    res.statusMessage = 'OK';

    const reqUrl = req.url;
    const splitedUrl = reqUrl.split('/').filter((e) => e.length > 0);

    if (splitedUrl[0] !== 'file') {
      res.end('Please, start your path with <file>');
    }

    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const fileName = `public/${normalizedUrl.pathname.slice(6)}`;

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 400;
      res.end('Path having duplicated slashes');
    }

    if (fileName) {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (!err) {
          res.end(data);
        } else {
          res.statusCode = 400;
          res.end('Whong path, file does not exist');
        }
      });
    }
  });

  return server;
}

module.exports = {
  createServer,
};
