'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const pathname = normalizedUrl.pathname;

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('404 Not Found');
    }

    if (!pathname.startsWith('/file')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;

      return res.end(
        JSON.stringify('Invalid URL. To load files, use /file/<file_path>'),
      );
    }

    const fileName =
      pathname === '/file' || pathname === '/file/'
        ? 'index.html'
        : pathname.slice('/file/'.length);

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');

        return res.end('404 Not Found');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
