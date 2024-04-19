'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Failed path');
    } else if (!pathname.startsWith('/file')) {
      res.statusCode = 200;
      res.end('To get any file the path must start with /file');
    } else {
      let fileName = pathname.split('/file')[1];

      if (fileName?.startsWith('/')) {
        fileName = fileName.slice(1);
      }

      const destination = path.join('./public/', fileName || 'index.html');

      fs.readFile(destination, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end('Non-existent file');
        } else if (!destination.startsWith('public')) {
          res.statusCode = 400;
          res.end('Access denied');
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });
    }
  });

  return server;
}

module.exports = { createServer };
