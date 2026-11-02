'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const url = new URL(`http://localhost${req.url}`);

    if (req.url.includes('../')) {
      res.setHeader('Content-type', 'text/plain');
      res.statusCode = 400;
      res.end("the url can't include '../'");

      return;
    }

    if (req.url.includes('//')) {
      res.setHeader('Content-type', 'text/plain');
      res.statusCode = 404;
      res.end("the url can't include '//'");

      return;
    }

    if (!url.pathname.startsWith('/file/')) {
      res.setHeader('Content-type', 'text/plain');

      if (path.extname(url.pathname)) {
        res.statusCode = 400;
        res.end('only files from /file/ are available');

        return;
      }

      res.end('the url have to start /file/');

      return;
    }

    const neededPath = url.pathname.slice(6) || 'index.html';
    const filePath = path.join(__dirname, `../public/${neededPath}`);
    const ext = path.extname(neededPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end("file doesn't exist");

        return;
      }

      if (ext === '.html') {
        res.setHeader('Content-Type', 'text/html');
      } else if (ext === '.css') {
        res.setHeader('Content-Type', 'text/css');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }

      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
