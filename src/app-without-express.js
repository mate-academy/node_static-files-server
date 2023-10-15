/* eslint-disable-no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  let pathname = `./public${parsedUrl.pathname}`;

  if (!pathname.startsWith('./public/file/')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('To load files, use /file/ as a prefix in the path.');

    return;
  }

  pathname = pathname.replace('/file/', '/');

  fs.access(pathname, fs.constants.F_OK, (accessErr) => {
    if (accessErr) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);

      return;
    }

    fs.stat(pathname, (statErr, stats) => {
      if (statErr || !stats) {
        res.statusCode = 500;
        res.end(`Error getting file stats.`);

        return;
      }

      if (stats.isDirectory()) {
        pathname += '/index.html';
      }

      fs.readFile(pathname, (readErr, data) => {
        if (readErr) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${readErr}.`);
        } else {
          res.setHeader('Content-type', 'text/html');
          res.end(data);
        }
      });
    });
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
