'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname.includes('//')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    if (!pathname.startsWith('/file')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('To load files, use the path /file/{filename}');
    }

    const fileName = pathname.startsWith('/file/')
      ? pathname.replace('/file/', '')
      : 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
