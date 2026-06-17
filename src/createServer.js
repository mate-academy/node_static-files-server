'use strict';

const path = require('path');
const fs = require('fs');
const http = require('http');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const url = req.url;

    if (url.indexOf('//') !== -1) {
      res.setHeader('content-type', 'text/plain');
      res.writeHead(404);

      res.end('Error: Paths having duplicated slashes.');

      return;
    }

    let filePath = '';

    if (url === '/file') {
      filePath = path.resolve(
        __dirname,
        url.replace('/file', '../public/index.html'),
      );
    } else if (url === '/file/') {
      filePath = path.resolve(
        __dirname,
        url.replace('/file/', '../public/index.html'),
      );
    } else {
      filePath = path.resolve(__dirname, url.replace('/file', '../public'));
    }

    if (filePath.indexOf('public') === -1) {
      res.setHeader('content-type', 'text/plain');
      res.writeHead(400);

      res.end('Error: Attempt to access files outside public folder');

      return;
    }

    if (!fs.existsSync(filePath)) {
      res.setHeader('content-type', 'text/plain');
      res.writeHead(404);

      res.end(`Error: File: ${filePath} does not exist.`);

      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    res.setHeader('content-type', 'text/plain');

    res.writeHead(200);

    res.end(fileContent);
  });

  return server;
}

module.exports = {
  createServer,
};
