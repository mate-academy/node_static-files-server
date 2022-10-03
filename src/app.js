'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const path = normalizedURL.pathname.slice(1).split('/');
  const fileFolder = path[0] === 'file' ? 'public/' : '';
  const fileName = path.slice(1).join('/') || 'index.html';

  if (fileFolder) {
    fs.readFile(`${fileFolder}${fileName}`, (error, data) => {
      if (error) {
        res.statusCode = 404;
        res.end();
      } else {
        res.end(data);
      }
    });
  } else {
    res.end('Pathname should starts with /file/');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
