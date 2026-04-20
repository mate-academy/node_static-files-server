/* eslint-disable no-useless-return */
'use strict';

const http = require('node:http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const absolutePaths = path.resolve(url.pathname);

    res.setHeader('Content-Type', 'text/plain');

    if (!absolutePaths.includes('file')) {
      res.statusCode = 400;
      res.end();
    } else if (!url.pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.write('Path should starts with /folder/');
      res.end();
    } else if (url.pathname.includes('//')) {
      res.statusCode = 404;
      res.write('Paths having duplicated slashes');
      res.end();
    } else {
      const isPath = path.join(
        __dirname,
        '..',
        req.url.replace('file', 'public'),
      );

      fs.readFile(isPath, 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end('Not exist such field!');
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });
    }
  });

  return server;
}

module.exports = {
  createServer,
};
