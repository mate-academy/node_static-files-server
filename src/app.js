'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 5700;

http.createServer((req, res) => {
  const normalizedURL
    = new url.URL(req.url, `http://${req.headers.host}`);

  let path = normalizedURL.pathname;

  if (!path.startsWith('/file')) {
    const message = `Wrong path name. For getting files use:
 /file/<file.name> or /file/<directory>/<file.name>`;

    res.end(message);

    return;
  }

  if (path === '/file/' || path === '/file') {
    path = '/file/index.html';
  }

  const normalizedPath = path.replace('/file/', 'src/public/');

  fs.readFile(normalizedPath, (error, data) => {
    if (!error) {
      res.end(data);

      return;
    }

    res.statusCode = 404;
    res.end();
  });
}).listen(PORT);
