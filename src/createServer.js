/* eslint-disable max-len */
'use strict';

const http = require('node:http');
const fs = require('fs');
const { isPathValid, normalizePath } = require('./utils/pathHelper');

const PROTOCOL = 'http';
const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const OK_CODE = 200;
const SERVER_ERROR_CODE = 500;
const BAD_REQUEST_MESSAGE = 'to load files write path like this \'files/\'path_to_file\'\'';
const NOT_FOUND_MESSAGE = 'The file doesn\'t exist';
const SERVER_ERROR_MESSAGE = 'Error while reading file';

const isBadRequest = (path) => !isPathValid(path);
const isNotFound = (path) => !fs.existsSync(path) || path.includes('//');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    req.setEncoding('utf-8');

    const base = `${PROTOCOL}://${req.headers.host}`;
    const { pathname } = new URL(req.url, base);
    const normalizedPathname = pathname.slice(1);
    let isFinished = false;

    if (isBadRequest(normalizedPathname)) {
      res.statusCode = BAD_REQUEST_CODE;
      res.end(BAD_REQUEST_MESSAGE);
      isFinished = true;
    }

    const normalizedPathToFile = normalizePath(normalizedPathname);

    if (!isFinished && !normalizedPathToFile) {
      res.statusCode = OK_CODE;
      res.end(BAD_REQUEST_MESSAGE);
      isFinished = true;
    }

    const absolutePathToFile = 'public/' + normalizedPathToFile;

    if (!isFinished && isNotFound(absolutePathToFile)) {
      res.statusCode = NOT_FOUND_CODE;
      res.end(NOT_FOUND_MESSAGE);
      isFinished = true;
    }

    if (!isFinished) {
      fs.readFile(absolutePathToFile, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          res.statusCode = SERVER_ERROR_CODE;
          res.end(SERVER_ERROR_MESSAGE);
        }

        res.statusCode = OK_CODE;
        res.end(data);
      });
    }
  });
}

module.exports = {
  createServer,
};
