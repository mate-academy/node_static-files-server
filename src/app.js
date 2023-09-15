/* eslint-disable no-console */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  const parts = normalizedURL.pathname.slice(1).split('/');

  if (parts[0] !== 'file') {
    res.end('Pathname must start with "/file/"');

    return;
  }

  const filePath = parts.slice(1).join('/') || 'index.html';

  fs.readFile(`./public/${filePath}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('This file does not exist.');
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
