/* eslint-disable no-console */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const url = require('node:url');
const path = require('node:path');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    const publicDir = path.resolve(__dirname, '../public');
    const normilizedURL = new url.URL(req.url, `http://${req.headers.host}`);
    const filePath = normilizedURL.pathname;
    const format = filePath.split('.')[1];

    if (req.url === '/app.js') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad request');

      return;
    }

    if (req.url.includes('/file/..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad request');

      return;
    }

    if (!filePath.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Use /file/<path-to-file> to load files from public folder');

      return;
    }

    const relativePath = filePath.slice('/file/'.length);

    if (relativePath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');

      return;
    }

    fs.readFile(path.join(publicDir, relativePath), (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', `text/${format}`);
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
