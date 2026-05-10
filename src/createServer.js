/* eslint-disable no-console */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
    const fileName = normalizedURL.pathname;

    if (!fileName.startsWith('/file/')) {
      if (fileName === '/file') {
        res.statusCode = 200;
      } else {
        res.statusCode = 400;
      }
      res.setHeader('Content-Type', 'text/plain');
      res.end('You need to set path starting with "/file/"');

      return;
    }

    if (fileName.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      res.end('You can`t type double slash(/)');

      return;
    }

    if (req.url.includes('../') || req.url.includes('..%2F')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end("You can't go outside /file folder");

      return;
    }

    const relativePath = fileName.replace('/file/', '');
    const fileToRead = relativePath || 'index.html';
    const publicDir = path.resolve('./public');
    const resolvedPath = path.resolve(`./public/${fileToRead}`);

    if (
      !resolvedPath.startsWith(publicDir + path.sep) &&
      resolvedPath !== publicDir
    ) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end("You can't go outside /file folder");

      return;
    }

    fs.readFile(`./public/${fileToRead}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Not Found`);

        return;
      }

      const ext = path.extname(relativePath);
      const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
      };
      const contentType = contentTypes[ext] || 'text/plain';

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
