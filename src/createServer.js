'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    const filePath = req.url;

    if (filePath.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('path should not contain ..');

      return;
    } else if (filePath.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Invalid path');

      return;
    } else if (filePath === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      res.end(
        'path to file should start with /file/ and include the file name',
      );

      return;
    } else if (!filePath.startsWith('/file/')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('path to file should start with /file/');

      return;
    }

    const relativePath = filePath.slice('/file/'.length);
    let fileData;

    try {
      if (relativePath === '') {
        fileData = fs.readFileSync('./public/index.html');
      } else {
        fileData = fs.readFileSync(`./public/${relativePath}`);
      }
    } catch (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');

      return;
    }
    res.statusCode = 200;

    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    res.end(fileData);
  });
}

module.exports = {
  createServer,
};
