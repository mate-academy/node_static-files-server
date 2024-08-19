'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const server = http.createServer((req, res) => {
    const normUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const path = normUrl.pathname;
    const file = path.replace('/file', '') || 'index.html';

    if (path.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Valid request');

      return;
    }

    if (!path.startsWith('/file')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('The request must start with /file/');

      return;
    }

    if (!fs.existsSync(`./public/${file}`)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File does not exist');

      return;
    }

    fs.readFile(`./public/${file}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not foud');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
