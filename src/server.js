/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');

    const myURL = new URL(req.url, 'http://localhost:5700');
    const pathArr = myURL.pathname.slice(1).split('/');

    if (pathArr[0] === 'file') {
      const isFilePathValid = myURL.pathname.includes('file/')
        && pathArr[1] !== '';

      const fileToGet = isFilePathValid
        ? pathArr.slice(1).join('/') : 'index.html';

      fs.readFile(`public/${fileToGet}`, (err, data) => {
        if (!err) {
          res.end(data);

          return;
        }

        res.statusCode = 404;
        res.end('File not found');
      });
    } else {
      res.end('Wrong filepath. Enter /file...');
    }
  });
}

module.exports = createServer;
