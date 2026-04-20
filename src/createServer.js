'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');

    if (path.dirname(req.url) === '/') {
      if (req.url.includes('file')) {
        return res.end('Hint');
      }
      res.statusCode = 400;

      return res.end('Hint');
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;

      return res.end('Bad boy');
    }

    const normalizeURL = new URL(req.url, `http://${req.headers.host}`);

    const oldPath = normalizeURL.pathname;

    const correctPath = oldPath.replace('/file/', 'public/');

    fs.readFile(`${correctPath}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;

        return res.end(data);
      }
      res.statusCode = 404;

      return res.end('Not existing');
    });
  });
}

module.exports = {
  createServer,
};
