'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (req.url.includes('../')) {
      res.statusCode = 400;

      res.end('Acces denied`');

      return;
    }

    if (!normalizedUrl.pathname.startsWith('/file/')) {
      res.end('Hint: for load file `pathname` must start with `/file/`');

      return;
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Double "//" not supported.');

      return;
    }

    const fileName = normalizedUrl.pathname.slice(6);

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        return res.end(data);
      }

      res.statusCode = 404;
      res.end('File doesnt exist');
    });
  });
}

module.exports = {
  createServer,
};
