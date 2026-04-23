'use strict';

const http = require('node:http');
const fs = require('fs');
const mime = require('mime-types');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class

  const server = http.createServer((req, res) => {
    const reqArr = req.url.split('?');
    const pathParts = reqArr[0].split('/');
    // const params = reqArr[1]
    // ? new URLSearchParams(reqArr[1])
    // : new URLSearchParams();
    const realPathParts = pathParts.filter((v) => {
      return v !== '';
    });

    if (req.url.indexOf('//') >= 0) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;

      res.end('path to file should not have duplicate /');

      return;
    }

    if (realPathParts[0] !== 'file') {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;

      res.end('path to file should start with /file/');

      return;
    }

    if (realPathParts.length === 1) {
      realPathParts.push('index.html');
    }

    realPathParts[0] = 'public';

    const realPath = realPathParts.join('/');

    // check if file exists
    if (!fs.existsSync(realPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;

      res.end('File does not exist');

      return;
    }

    const data = fs.readFileSync(realPath);

    const contentType = mime.lookup(realPath);

    res.setHeader('Content-Type', contentType);
    res.statusCode = 200;
    res.end(data);
  });

  return server;
}

module.exports = {
  createServer,
};
