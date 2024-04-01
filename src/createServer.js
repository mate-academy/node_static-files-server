'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'text/plain');

    if (pathname === '/file') {
      return res.end('WARNING: must be "/file/fileName"');
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;

      return res.end('HINT: routes not starting with "/file/"');
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('ERROR: paths having duplicated slashes');
    }

    const path = pathname.replace('/file', '') || 'index.html';

    fs.readFile(`./public${path}`, (err, data) => {
      if (err) {
        res.statusCode = 404;

        return res.end('ERROR: non-existent files');
      }

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
