/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    const normalizeURL = new url.URL(req.url, `http://${req.headers.host}`);
    const pathToFile = normalizeURL.slice(1) || 'index.html';

    fs.readFile(`public/${pathToFile}`, (error, data) => {
      if (!error) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  });
}

createServer().listen(3000);
