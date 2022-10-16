/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  if (!normalizedURL.pathname.startsWith('/file')) {
    res.end('Path must starts with /file');
  }

  let fileName = normalizedURL.pathname.replace('/file', '') || '/index.html';

  if (fileName.length === 1 && fileName.endsWith('/')) {
    fileName = '/index.html';
  }

  fs.readFile(`./public${fileName}`, (readError, data) => {
    if (readError) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
