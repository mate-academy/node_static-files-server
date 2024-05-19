'use strict';

const http = require('http');
const fs = require('fs');
const { validateUrl } = require('./validateUrl');
const { statusMessages, statusCodes } = require('./constants');

function createServer() {
  return http.createServer((req, res) => {
    const fullPath = validateUrl(req, res);

    // eslint-disable-next-line no-console
    if (!fullPath) {
      return;
    }

    fs.readFile(fullPath, { encoding: 'utf8' }, (err, data) => {
      res.setHeader('Content-Type', 'text/plain');

      if (err) {
        res.statusCode = statusCodes[404];
        res.end(statusMessages.requestStart);

        return;
      }

      res.statusCode = statusCodes[200];

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
