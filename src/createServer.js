'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;

      res.end(
        `If you want load file, you must write path in this format "/file/FILE_NAME"`,
      );

      return;
    }

    const filePath =
      './public/' + (pathname.split('/file/')[1] || 'index.html');

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end(`File doesn't exists`);

      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end();

        return;
      }
      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
