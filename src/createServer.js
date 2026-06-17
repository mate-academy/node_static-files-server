'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer((req, res) => {
    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;

      res.end(
        `If you want load file, you must write path in this format "/file/FILE_NAME"`,
      );

      return;
    }

    const filePath =
      './public/' + (normalizedUrl.pathname.split('/file/')[1] || 'index.html');

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end("File doesn't exists");

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
