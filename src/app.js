/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, 'http://localhost:8080/file');
  const fileName = normalizedURL.pathname
    .split('/').slice(2).join('/') || 'index.html';
  // the same on bottom normalizedURL
  // const fileName = req.url.slice(1).replace(/\.\.\//g, '')
  //  || 'index.html';

  const condition = normalizedURL.pathname.slice(1).split('/')[0];

  if (condition === 'file' || condition === '') {
    fs.readFile(`./public/${fileName}`, (er, data) => {
      if (er) {
        res.statusCode = 404;
        res.end();
      } else {
        res.end(data);
      }
    });
  } else {
    res.end('Enter /file/<path>/<file name> to get file');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
