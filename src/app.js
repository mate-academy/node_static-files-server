'use strict';
/* eslint-disable no-console */

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  let fileName = normalizedURL.pathname;

  if (!fileName.startsWith('/file')) {
    console.log('To load file write: "/file/-path-to-file-"');
    res.end();
  }

  fileName = normalizedURL.pathname.replace(/\/file\/*/, '') || 'index.html';

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      res.end(data);

      return;
    }

    res.statusCode = 404;
    res.end('no such file');
  });
});

const PORT = process.env.port || 3000;

server.listen(PORT, () => {
  console.log('Server is running');
});
