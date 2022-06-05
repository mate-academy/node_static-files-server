/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let fileName = req.url.slice(1).replace('file', '');

  if (fileName.length < 2) {
    fileName = 'index.html';
  }

  fs.readFile(`src/public/${fileName}`, (error, data) => {
    if (!error) {
      return res.end(data);
    }

    res.statusCode = 404;

    return res.end('You need write file/');
  });
});

server.listen(PORT, () => {
  console.log(`Created server http://localhost:${PORT}`);
});
