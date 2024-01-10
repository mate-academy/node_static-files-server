/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalize = new url.URL(req.url, `http://${req.headers.host}`);

  let startIndex = 0;
  let fileName = 'index.html';

  if (normalize.pathname.includes('file')) {
    startIndex = normalize.pathname.indexOf('file') + 4;

    if (normalize.pathname.endsWith('file/')) {
      startIndex++;
    }

    fileName = normalize.pathname.slice(startIndex) || 'index.html';
  }

  console.log(fileName);

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (!err) {
      res.statusCode = 200;
      res.end(JSON.stringify(data.toString()));
    } else {
      res.statusCode = 404;
      res.end("This file doesn't exist");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
