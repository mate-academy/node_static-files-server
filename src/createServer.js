'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.end('Invalid request: request must start'
        + ' with "/file/" + directory or file path');

      return;
    }

    let fileName = pathname.slice(1).replace('file', 'public');

    fs.stat(fileName, (err, stats) => {
      if (!err) {
        if (stats.isDirectory()) {
          fileName.endsWith('/')
            ? fileName += 'index.html'
            : fileName += '/index.html';
        }

        fs.readFile(fileName, 'utf8', (error, data) => {
          if (!error) {
            res.end(data);
          }
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  });
}

module.exports = {
  createServer,
};
