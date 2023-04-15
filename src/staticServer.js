'use strict';

const http = require('http');
const fs = require('fs');

const staticServer = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const fileName = pathname.slice(6) || 'index.html';

  if (!pathname.startsWith('/file/')) {
    res.statusCode = 400;

    res.end(
      'Invalid request! Please make sure your pathname starting with /file/'
    );
  }

  fs.readFile(`./public/${fileName}`, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 400;

      res.end('Wooops! Looks like file does not exist!');
    }

    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;

    res.end(data);
  });
});

module.exports = { staticServer };
