/* eslint-disable no-useless-return */
/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);

  if (!normalizedURL.pathname.startsWith('/file')) {
    res.statusCode = 400;
    res.end('To load files, use URLs starting with /file/');

    return;
  }

  const fileName = normalizedURL.pathname.slice('/file/'.length)
    || 'index.html';
  const filePath = path.join(PUBLIC_DIR, fileName);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();

      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
