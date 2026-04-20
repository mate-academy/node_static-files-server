/* eslint-disable max-len */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    if (req.url.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Denied');

      return;
    }

    const fileName =
      !normalizedUrl.pathname.slice(5) ||
      normalizedUrl.pathname.slice(5) === '/'
        ? 'index.html'
        : normalizedUrl.pathname.slice(6);

    if (fileName.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Dont use // in the path');

      return;
    }

    if (fileName.includes('/../')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      res.end('Denied');

      return;
    }

    const publicDir = path.resolve('public');
    const filePath = path.resolve(publicDir, fileName);

    if (!filePath.startsWith(publicDir)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Access denied');

      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');

        res.end(
          'Hint: to load files, use path starting with "/file/", e.g. /file/index.html',
        );
      }
    });
  });
}

module.exports = {
  createServer,
};
