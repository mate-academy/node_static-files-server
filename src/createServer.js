/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const { STATUS_CODES, ERROR } = require('./variables');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (!req.url.includes('/file')) {
      res.statusCode = STATUS_CODES.BAD_REQUEST;
      res.end(ERROR.INVALID_REQUEST);

      return;
    }

    if (!req.url.startsWith('/file/')) {
      res.statusCode = STATUS_CODES.OK;
      res.end(ERROR.INVALID_REQUEST);

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = STATUS_CODES.NOT_FOUND;
      res.end(ERROR.NOT_FOUND);

      return;
    }

    const filename = normalizedUrl.pathname.slice('/file/'.length)
      || 'index.html';

    fs.readFile(`./public/${filename}`, (err, data) => {
      if (!err) {
        res.statusCode = STATUS_CODES.OK;
        res.end(data);
      } else {
        if (err.code === 'ENOENT') {
          res.statusCode = STATUS_CODES.NOT_FOUND;
          res.end(ERROR.NOT_FOUND);
        } else {
          res.statusCode = STATUS_CODES.NOT_FOUND;
          res.end(ERROR.SERVER_ERROR);
        }
      }
    });
  });
}

module.exports = {
  createServer,
};
