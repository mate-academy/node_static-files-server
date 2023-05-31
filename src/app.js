/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const filePath = normalizedUrl.pathname.slice(1);
  const isCorectPath = filePath.startsWith('file');

  if (!isCorectPath) {
    res.statusCode = 400;
    res.end('Your request should start with </file/>');
  }

  const correctPath = filePath.slice(5) || 'index.html';

  fs.readFile(`src/public/${correctPath}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('Page with provided URL doesn\'t exist');
    } else {
      res.statusCode = 200;
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
