'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    const normUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const path = normUrl.pathname;
    const file = path.replace('/file', '') || 'index.html';

    if (path.includes('//')) {
      res.writeHead(404, 'Content-Type', 'text/plain');

      return res.end('Valid request');
    }

    if (!path.startsWith('/file')) {
      res.writeHead(400, 'Content-Type', 'text/plain');

      return res.end('The request must start with /file/');
    }

    if (!fs.existsSync(`./public/${file}`)) {
      res.writeHead(404, 'Content-Type', 'text/plain');

      return res.end('File does not exist');
    }

    fs.readFile(`./public/${file}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.writeHead(200, 'Content-Type', 'text/plain');

        return res.end(data);
      }

      res.writeHead(404, 'Content-Type', 'text/plain');
      res.end('Not foud');
    });
  });
}

module.exports = {
  createServer,
};
