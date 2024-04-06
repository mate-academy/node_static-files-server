'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const urlPath = req.url;
    const fileName = urlPath.replace('/file/', '') || 'index.html';

    res.setHeader('Content-Type', 'text/plain');

    if (urlPath.includes('../')) {
      res.statusCode = 400;
      res.end("Don't use traversal paths");

      return;
    }

    if (!urlPath.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('Please prefix the file path with /file/ to load files.');

      return;
    }

    if (urlPath.includes('//')) {
      res.statusCode = 404;
      res.end("Don't use duplicated slashes");

      return;
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('File not found');
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
