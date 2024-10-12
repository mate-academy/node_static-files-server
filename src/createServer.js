'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}/`);
    const regex = new RegExp(/^\/file\/?/);
    const pathToFile = path.join(
      __dirname,
      '..',
      'public',
      pathname.replace(regex, ''),
    );

    res.setHeader('Content-Type', 'text/plain');

    // eslint-disable-next-line no-console
    console.log(pathname, pathToFile);

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Operation not allowed');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('Should add "/file/" at path start');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end('Double slashes path not allowed');

      return;
    }

    if (!fs.existsSync(pathToFile)) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    fs.readFile(pathToFile, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Something went wrong with file');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  });
}

module.exports = {
  createServer,
};
