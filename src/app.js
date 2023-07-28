'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}/`);
  const urlParts = normalizedUrl.pathname.slice(1).split('/');

  if (urlParts[0] !== 'file') {
    res.statusCode = 400;
    res.statusMessage = 'Wrong path';

    res.end('Request path must start with /file');

    return;
  }

  let filePath = `./src/public/${urlParts.slice(1).join('/')}`;

  if (filePath === './src/public/') {
    filePath = './src/public/index.html';
  }

  if (filePath.split('.')[filePath.split('.').length - 1] === 'html') {
    res.setHeader('Content-Type', 'text/html');
  } else {
    res.setHeader('Content-Type', 'text/plain');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.statusMessage = 'File not found';

      res.end('404 File not found');

      return;
    }

    res.statusCode = 200;
    res.statusMessage = 'OK';

    res.end(data);
  });
});

server.listen(3000);
