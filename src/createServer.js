'use strict';

const http = require('http');
const fs = require('fs');
const { validateUrl } = require('./validateUrl');

function createServer() {
  return http.createServer((req, res) => {
    const fullPath = validateUrl(req, res);

    // eslint-disable-next-line no-console
    if (!fullPath) {
      return;
    }

    fs.readFile(fullPath, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('request should starts with "file"');

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
