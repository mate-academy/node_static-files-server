/* eslint-disable no-console */

'use strict';

const http = require('http');
const fs = require('fs');
const PORT = 3001;

const server = http.createServer((req, resp) => {
  resp.setHeader('Content-Type', 'application/json');

  const url = new URL(req.url, `http://${req.headers.host}`);

  const pathToFile = url.pathname.slice(6) || 'index.html';

  if (!url.pathname.startsWith('/file') && url.pathname !== '/') {
    resp.statusCode = 400;

    resp.end('You should write "/file" in the beginning');

    return;
  }

  if (!pathToFile) {
    resp.statusCode = 404;
    resp.end('File not found');
  }

  fs.readFile(`./public/${pathToFile}`, (error, data) => {
    if (error) {
      resp.statusCode = 404;
      resp.end('File not found');
    }

    resp.end(data);
  });
});

server.listen(PORT, () => console.log('SERVER STARTED'));
